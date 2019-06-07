const functions = require('firebase-functions');
const routes = require('./src/routes');
module.exports.configs = functions.https.onRequest(routes);