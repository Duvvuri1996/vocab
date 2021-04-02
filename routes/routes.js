const express = require('express');
const config = require('../config');
const controller = require('../controller/controller');

module.exports.setRouter = (app) => {
    const url = `${config.apiVersion}/`

    app.post(`${url}createVocab/:wordId`, controller.createVocab);

    app.get(`${url}getVocab/:wordId`, controller.getVocab);

    app.get(`${url}searchVocab/:wordId`, controller.searchVocab);

    app.get(`${url}getAll`, controller.getAll);

}