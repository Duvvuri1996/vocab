const response = require('../lib/responseLib');

let errorHandler = (err, req, res, next) => {
    console.log("errorHandler called")
    console.log(err)
    let apiResponse = response.generate(true, 'Error occured at application level', 500, null)
    res.send(apiResponse)
} //Error response if there is any error at application level

let notFoundHandler = (req,res,next) => {
    console.log("notFoundHandler called")
    let apiResponse = response.generate(true, 'Route not found in the application', 404, null)
    res.status(404).send(apiResponse)
} //Route error response if the requested API/Route is not found in the application

/**
 * exporting these functions to use in other modules
 */
module.exports = {
    errorHandler : errorHandler,
    notFoundHandler : notFoundHandler
}