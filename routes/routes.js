const express = require('express');
const config = require('../config');
const controller = require('../controller/controller');

module.exports.setRouter = (app) => {
    const url = `${config.apiVersion}/`

    app.post(`${url}createVocab`, controller.createVocab);

    app.post(`${url}getVocab`, controller.getVocab);

    app.get(`${url}getAll`, controller.getAll);

}