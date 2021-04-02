const express = require('express');
const app = require('.');
let AppConfig = {}

AppConfig.port = 8080;
AppConfig.allowCORSOrigin = "*";
AppConfig.env = 'dev';
AppConfig.db = {
    uri : 'mongodb://127.0.0.1:27017/vocabDB'
}
AppConfig.apiVersion = '/api/v1';
AppConfig.oxford = {
    appId : '1e24bd30',
    appKey : '14603c8c50532483c8f5f0dc996bec9e',
    baseUrl : '	https://od-api.oxforddictionaries.com/api/v2'
}

module.exports = {
    port : AppConfig.port,
    allowCORSOrigin : AppConfig.allowCORSOrigin,
    env : AppConfig.env,
    db : AppConfig.db,
    apiVersion : AppConfig.apiVersion,
    oxford : AppConfig.oxford
}