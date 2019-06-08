const functions = require('firebase-functions');
const boom = require('express-boom');
const config = require('./config');
const express = require('express');
const app = express();
module.exports = app;

// Middleware
app.use(boom());
app.use(function (req, res, next) {
    const password = functions.config().configs.password;
    const clientPassword = req.header('Authorization');

    if (clientPassword !== password) {
        return res.boom.unauthorized();
    }

    return next();
});

// Get config for specified app and environment
app.get('/:app/:environment', async function (req, res) {
    try {
        const data = await config.getConfig(req.params.app, req.params.environment);
        return res.send(data);
    } catch (error) {
        return res.boom.badImplementation();
    }
});