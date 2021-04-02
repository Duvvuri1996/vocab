const oxford = require('oxford-dictionaries-api');
const mongoose = require('mongoose');
const config = require('../config');
const http = require('https');
const response = require('../lib/responseLib');
const vocabModel = require('../models/vocab');
const check = require('../lib/checkLib');
const logger = require('../lib/logger');
const { error } = require('../lib/logger');

const appId = config.oxford.appId;
const appKey = config.oxford.appKey;
const strictMatch = "false";

//Get Vocab function returns an array of words that matches the search query
let getVocab = (req, res) => {
    let vocab = () => {
        return new Promise((resolve, reject) => {
            let wordId = req.params.wordId
            wordId = wordId.toLowerCase();
            console.log(wordId)
            vocabModel.find({ word: wordId}, (err, result) => {
                    if(err){
                        logger.error(err, 'Unknown error at getVocab() function', 10)
                        let apiResposne = response.generate(true, "Unknwon error", 404, 'Unkown error')
                        reject(apiResposne)
                    }    
                    else if(check.isEmpty(result)){
                            logger.error('No word found', 'at getVocab() function', 5)
                            let apiResponse = response.generate(true, "No word found", 500, 'No word found')
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

let searchVocab = (req, res) => {
    let vocab = () => {
        return new Promise((resolve, reject) => {
            let wordId = req.params.wordId
            wordId = wordId.toLowerCase();
            console.log(wordId)
            vocabModel.find({ $text: { $search : wordId }}, (err, result) => {
                    if(err){
                        logger.error(err, 'Unknown error at getVocab() function', 10)
                        let apiResposne = response.generate(true, "Unknwon error", 404, 'Unkown error')
                        reject(apiResposne)
                    }    
                    else if(check.isEmpty(result)){
                            logger.error('No word found', 'at getVocab() function', 5)
                            let apiResponse = response.generate(true, "No word found", 500, 'No word found')
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
}

//Create Vocab function converts given word into lowercase and will query the dictionary and caches into the database
let createVocab =  (req, res) => {
    let create = () => {
        return new Promise((resolve, reject) => {
            let wordId = req.params.wordId
            wordId = wordId.toLowerCase()
            vocabModel.findOne({ word : wordId }, (err, result) => {
            if(check.isEmpty(result)){
            const options = {
                host: 'od-api.oxforddictionaries.com',
                port: '443',
                path: '/api/v2/entries/en-us/' + wordId,
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
                    let data = JSON.parse(body).results[0].lexicalEntries
                    console.log(data)
                    let newVocab = new vocabModel({
                        word : wordId,
                        definition : JSON.stringify(data)
                    })
                    newVocab.save((err, result) => {
                        if(err){
                            logger.error(err, 'at newVocab save function in getVocab', 5)
                            let apiResponse = response.generate(true, 'Unknown error occured', 404, err)
                            reject(apiResponse)
                        } else {
                            resolve(result) 
                            console.log(result)
                        }
                    })
                })
            })
        } else if(!check.isEmpty(result)){
            logger.error('World already exists', 'at createVocab() function', 10)
            let apiResponse = response.generate(true, 'Word exists', 500, 'Word exists')
            reject(apiResponse)
        }
            })
        })
    }
    create(req, res)
    .then((result) => {
        let apiResponse = response.generate(false, 'Successful', 200, result)
        res.send(apiResponse)
    }).catch((err) => {
        res.send(err)
    })
} //end of createVocab function

//Get All function retrieves all words cached into the database without calling dictionary API
let getAll =  (req, res) => {
   vocabModel.find().exec((err, details) => {
       if(err) {
           let apiResponse = response.generate(true, 'Unknown error occured', 500, null)
           res.send(apiResponse)
       } else if(check.isEmpty(details)){
           let apiResponse = response.generate(true, 'No data FOund', 404, null)
           res.send(apiResponse)
       } else{
           let apiResponse = response.generate(false, 'Data found', 200, details)
           res.send(apiResponse)
       }
   })
       
} //end of getAll function

module.exports = {
    getAll : getAll,
    createVocab : createVocab,
    getVocab : getVocab,
    searchVocab : searchVocab
}