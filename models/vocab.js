const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vocab = new Schema({
    word : String,
    definition : String
})

Vocab.index({ '$**' : 'text' });

module.exports = mongoose.model('Vocab', Vocab)