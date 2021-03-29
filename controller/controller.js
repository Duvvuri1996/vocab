const oxford = require('oxford-dictionaries-api');
const mongoose = require('mongoose');
const config = require('../config');
const http = require('https');
const response = require('../lib/responseLib');
const vocabModel = require('../models/vocab');
const check = require('../lib/checkLib');
const logger = require('../lib/logger');

const appId = config.oxford.appId;
const appKey = config.oxford.appKey;
const strictMatch = "false";

//Get Vocab function returns an array of words that matches the search query
let getVocab = (req, res) => {
    let vocab = () => {
        return new Promise((resolve, reject) => {
            let wordId = req.body.wordId
            wordId = wordId.toLowerCase();
            console.log(wordId)
            vocabModel.find({ $text: { $search : wordId }}, (err, result) => {
                    if(err){
                        logger.error(err, 'Unknown error at getVocab() function', 10)
                        let apiResposne = response.generate(true, "Unknwon error", 404, null)
                        reject(apiResposne)
                    }    
                    else if(check.isEmpty(result)){
                            logger.error('No word found', 'at getVocab() function', 5)
                            let apiResponse = response.generate(true, "No word found", 500, null)
                            reject(apiResponse)                         
                        } else {
                            resolve(result)
                        }
                    })
        })
    }
    vocab(req, res)
    .then((result) => {
        let apiResponse = response.generate(false, 'Successful', 200, result)
        res.send(apiResponse)
    }).catch((err) => {
        res.send(err)
    })
} //end of getVocab function

//Create Vocab function converts given word into lowercase and will query the dictionary and caches into the database
let createVocab =  (req, res) => {
    let create = () => {
        return new Promise((resolve, reject) => {
            let wordId = req.body.wordId
            wordId = wordId.toLowerCase()
            vocabModel.findOne({ word : wordId }, (err, result) => {
            if(check.isEmpty(result)){
            const options = {
                host: 'od-api.oxforddictionaries.com',
                port: '443',
                path: '/api/v2/entries/en-gb/' + wordId + '?strictMatch=' + strictMatch,
                method: "GET",
                headers: {
                  'app_id': appId,
                  'app_key': appKey
                }
            };
            http.get(options, (resp) => {
                let body = '';
                resp.on('data', (d) => {
                    body += d;
                });
                resp.on('end', () => {
                    let parsed = JSON.stringify(body);
                    let newVocab = new vocabModel({
                        word : wordId,
                        definition : parsed
                    })
                    newVocab.save((err, result) => {
                        if(err){
                            logger.error(err, 'at newVocab save function in getVocab', 5)
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    })
                })
            })
        } else if(!check.isEmpty(result)){
            logger.error('World already exists', 'at createVocab() function', 10)
            resolve('Word exists')
        }
            })
        })
    }
    create(req, res)
    .then((result) => {
        let apiResponse = response.generate(false, 'Successful', 200, result)
        res.send(apiResponse)
    }).catch((err) => {
        let apiResposne = response.generate(true, 'Error occurred', 404, null)
        res.send(apiResposne)
    })
} //end of createVocab function

//Get All function retrieves all words cached into the database without calling dictionary API
let getAll = async (req, res) => {
    try{
        let result = await vocabModel.find().lean()
        if(check.isEmpty(result)){
            logger.error('No data found', 'at getAll() function from controller', 5)
            let apiResponse = response.generate(true, 'No data found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Data found', 200, result)
            res.send(apiResponse)
        }
    } catch(error){
        logger.error(err, 'at getAll() function', 10)
        let apiResponse = resposne.generate(true, 'Unkown error occured', 500, null);
        res.send(apiResponse)
    }
} //end of getAll function

module.exports = {
    getAll : getAll,
    createVocab : createVocab,
    getVocab : getVocab
}