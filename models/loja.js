const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lojaSchema = new Schema( {

    nome: { type: String, unique: false, required: true},
    site: { type: String, unique: true, required: true},
    tipo: { type: String, unique: false, required: false},
    cidade: { type: String, unique: false, required: false},
    estado: { type: String, unique: false, required: false}

});

module.exports = mongoose.model('Loja', lojaSchema);