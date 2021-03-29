const logger = require('pino')();
const moment = require('moment');

//To Formatt the errors in a specified formatt in to our system

let captureError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = moment();

    let formattedError = {
        timeStamp : currentTime,
        errorMessage : errorMessage,
        errorOrigin : errorOrigin,
        errorLevel : errorLevel 
    }
    logger.error(formattedError)
    return formattedError
} //end captureError function

let captureInfo = (message, origin) => {
    let currentTime = moment()
    
    let formattedInfo = {
        timeStamp : currentTime,
        message : message,
        origin : origin,
    }
    logger.info(formattedInfo)
    return formattedInfo
} //end captureInfo function

/**
 * exporting these functions to use in other modules
 */
module.exports = {
    error : captureError,
    info : captureInfo
}