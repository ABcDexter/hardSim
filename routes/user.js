var express = require('express');
var router = express.Router();
var User = require('../model-schema/User.js');
var jwt = require("jsonwebtoken");
var config = require("../config.js");
var authentication = require("../services/authentication.js");

/**
 * Login user
 * Logic of user authentication
 * http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
 */
router.post('/login', function (req, res) {
    User.findOne({username: req.body.email, password: req.body.password}, function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                errorMessage: 'Sorry, but an unexpected error occurred.'
            });
        } else {
            if (user) {
                res.status(200);
                res.json({
                    data: user,
                    token: user.token
                });
            } else {
                res.status(401);
                res.json({
                    errorMessage: 'Incorrect login information.'
                });
            }
        }
    });
});

/**
 * Registrace uživatele
 */
router.post('/', function (req, res) {
    User.findOne({username: req.body.email}, function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                errorMessage: 'Sorry, but an unexpected error occurred.'
            });
        } else {
            if (user) {
                res.status(409);
                res.json({
                    errorMessage: 'A user with the same email is already registered.'
                });
            } else {
                var userModel = new User();
                userModel.username = req.body.email;
                userModel.password = req.body.password;
                userModel.firstname = req.body.firstname;
                userModel.surname = req.body.surname;
                userModel.save(function (err, user) {
                    user.token = jwt.sign(user, config.JWT_SECRET);
                    user.save(function (err, user1) {
                        res.status(201);
                        res.send(user1);
                    });
                });
            }
        }
    });
});

/**
 * Returns the logged in user
 * So far, the id is ignored and the user is searched directly according to the token of the logged in user.
 */
router.get('/:id', authentication.ensureAuthorized, function (req, res) {
    User.findOne({token: req.token}, function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                errorMessage: 'Sorry, but an unexpected error occurred.'
            });
        } else {
            res.status(200);
            res.send(user);
        }
    });
});

module.exports = router;
