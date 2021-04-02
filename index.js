const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const http = require('http');
const config = require('./config');
const cookieParser = require('cookie-parser')
const app = express();
const logger = require('./lib/logger');
const errorHandler = require('./middlewares/errorHandler');
const requestLog = require('./middlewares/reqLogger');
const cors = require('cors')

app.use(cors());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    next();
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(requestLog.logIp); //logs the router details and router method
app.use(errorHandler.errorHandler); //logs the error if any in the application

const routesPath = './routes';
const modelsPath = './models';
console.log(routesPath)

// fs.readdirSync(modelsPath).forEach(function (file) {
//     if(~file.indexOf('.js')) require(modelsPath+'/'+file)
// })

fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
}) //To send instance of express for requests and response

app.use(errorHandler.notFoundHandler); //logs the error if requested router is not in the application

/**
 * create http server
 */
const server = http.createServer(app);
server.listen(process.env.PORT || config.port);
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' is not an equal listener', 'serverOnErrorHandler', 10)
        throw error
    }
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ' permission denied', 'serverOnErrorHandler', 10)
            /**
             * The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code
             * 0 for Success and 1 for failure
             */
            process.exit(1)
            break;
            //EADDRINUSE - the port number which listen() tries to bind the server which is already in use.
        case 'EADDRINUSE':
            logger.error(error.code + ' port already in use', 'serverOnErrorHandler', 10)
            process.exit(1)
            break;
        default:
            logger.error(error.code + ' :unknown error occured', 'serverOnErrorHandler', 10)
            throw error;
    }
});

server.on('listening', () => {
    logger.info('server listening on port' + server.address().port, 'serverOnlisteningHandler', 10);
    let db = mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true
    })
});

mongoose.connection.on('error', (error) => {
    logger.error(error, 'mongoose connection on error handler', 10)
})

mongoose.connection.on('open', (err) => {
    if(err) {
        console.log('Database error while connecting')
        logger.error(err, 'error at mongoose connection on open handler', 10);
    } else {
        logger.info("DB connection open", 'mongoose connection on open handler', 10)
    }
})

module.exports = app;


