var path = require('path');

/**
 * Database connection
 */
function connectToDB() {
    var mongoose = require('mongoose');
    var mdb = 'mongodb+srv://madmin:4E2F7pCNb8fMxex@cluster0.sm7iv.gcp.mongodb.net/simulator?retryWrites=true&w=majority';


    mongoose.connect(process.env.MONGODB_URI || mdb || 'mongodb://127.0.0.1:27017/simulator', function (err) {
        if (err) {
            console.log('connection error', err);
        } else {
            console.log('connection successful');
        }
    });
}

/**
* View engine settings
 */
function setUpViewEngine(app) {
    // view engine setup
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, 'views'));
}

/**
 * Middleware component settings
 */
function setUpMiddleWare(app) {
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var express = require('express');
    var favicon = require('serve-favicon');
    var logger = require('morgan');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '/../client')));

    //Security settings for API
    app.use(function (req, res, next) {
        //Allows access to the API from any domain
        res.setHeader('Access-Control-Allow-Origin', '*');
        //Only POST, GET, PUT, DELETE requests can be sent
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT', 'DELETE');
        //X-Requested-With and content-type headers are allowed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    });
}

module.exports = {
    JWT_SECRET: 'ba51d54wq4d54wqdas4d5sa4d', //server key to create a unique token for each user
    connectToDB: connectToDB,
    setUpViewEngine: setUpViewEngine,
    setUpMiddleWare: setUpMiddleWare
};
