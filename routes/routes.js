const express = require('express');
const config = require('../config');
const controller = require('../controller/controller');

module.exports.setRouter = (app) => {
    //const url = `${config.apiVersion}/`

    app.post(`/createVocab/:wordId`, controller.createVocab);

    app.get(`/getVocab/:wordId`, controller.getVocab);

    app.get(`/searchVocab/:wordId`, controller.searchVocab);

    app.get(`/getAll`, controller.getAll);

}