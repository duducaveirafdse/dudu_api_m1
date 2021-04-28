const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const lojas = require('../models/loja');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

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
        const loja = await lojas.find({});
            return res.send(loja);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca do Loja!' });
    }
});

router.post('/create', async (req, res) => {
    const { nome, site, tipo, cidade, estado } = req.body;

    if (!nome || !site)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await lojas.findOne({ nome, site }))
            return res.send({ error: 'Loja já cadastrada!' });
        
        const loja = await lojas.create(req.body);

    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o Loja: ${err}`})
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { nome, site } = req.body;
    
    if (!nome || !site)
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados!' });
    try {
        if (await lojas.findOne({ nome, site }))
            return res.send({ error: 'Loja já cadastrada! '});
        
        const loja = await lojas.findByIdAndUpdate(req.params.id, req.body);
        const lojaChanged = await lojas.findById(req.params.id);

            return res.status(201).send({ lojaChanged });
    }
    catch (err) {
            return res.status(201).send({ error: `Erro ao atualizar o Loja: ${err}`})
    }
});

module.exports = router;