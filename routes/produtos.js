const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const produtos = require('../models/produto');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createUsuarioToken = (userId) => {
    return jwt.sign({
        id: userId},
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};

router.post('/auth', (req, res) => {
    
    const { login, senha} = req.body;

    if (!login || !senha) 
        return res.send({ error: 'Login Inválido!' });

    usuarios.findOne({ login }, (err, data) => {
        if (err)
            return res.send({ error: 'Erro ao buscar Login!' });
        if (!data)
            return res.send({ error: 'Login não encontrado!' });

        bcrypt.compare(senha, data.senha, (err, same) => {
            if (!same)
                return res.send({ error: 'Erro na Autenticação!' });
            
            data.senha = undefined;
            return res.send({ data, token: createUsuarioToken(data.id)});
        });
    }).select('+senha');
});

router.get('/', async (req, res) => {
    try {
        const produto = await produtos.find({});
            return res.send(produto);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca do Produto!' });
    }
});

router.post('/create', async (req, res) => {
    const { nome, tipo, marca, preco, foto } = req.body;

    if (!nome || !marca || !preco > 0)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await produtos.findOne({ nome, marca, preco }))
            return res.send({ error: 'Produto já cadastrado!' });
        
        const produto = await produtos.create(req.body);

    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o Produto: ${err}`})
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { nome, tipo, marca, preco, foto } = req.body;

    if (!nome || !marca || !preco > 0)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await produtos.findOne({ nome, marca, preco }))
            return res.send({ error: 'Produto já cadastrado! '});
        
        const produto = await produtos.findByIdAndUpdate(req.params.id, req.body);
        const produtoAtt = await produtos.findById(req.params.id);

            return res.status(201).send({ produtoAtt });
    }
    catch (err) {
            return res.status(201).send({ error: `Erro ao atualizar o Produto: ${err}`})
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await produtos.findByIdAndDelete(req.params.id);
            return res.send({ error: 'Produto removido com sucesso!' });
    }
    catch (err) {
            return res.send({ error: 'Erro ao remover Produto! '});
    }
});


module.exports = router;