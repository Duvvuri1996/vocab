let generate = (err, message, status, data) => {
    let response = {
        error : err,
        message : message,
        status : status,
        data : data
    }
    return response
} //send response in a JSON format

/**
 * exporting these functions to use in other modules
 */
module.exports = {
    generate : generate
}