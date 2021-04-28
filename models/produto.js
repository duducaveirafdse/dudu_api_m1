const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produtoSchema = new Schema( {

    nome: { type: String, unique: false, required: true},
    tipo: { type: String, unique: false, required: false},
    marca: { type: String, unique: false, required: true},
    preco: { type: Number, unique: false, required: true},
    foto: { type: String, unique: false, required: false}

});

module.exports = mongoose.model('Produto', produtoSchema);