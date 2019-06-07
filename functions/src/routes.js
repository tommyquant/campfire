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

// Easy way to map environments to a different name in case the name is
// different in the remote config.
const envMappings = {
    'development': 'dev',
    'production': 'prod'
};

// Get config for specified app and environment
app.get('/:app/:environment', async function (req, res) {
    // Check if environment is valid
    const env = envMappings[req.params.environment];
    if (env === undefined) {
        return res.boom.badRequest('Undefined environment');
    }

    try {
        const data = await config.getConfig(req.params.app, env);
        return res.send(data);
    } catch (error) {
        return res.boom.badImplementation();
    }
});