const _ = require('lodash');
const admin = require('firebase-admin');
admin.initializeApp();
const basePath = 'configs';

/**
 * 
 * @param {*} appName 
 * @param {*} environment
 */
async function getConfig(appName, environment) {
    // Highest to lowest priority
    const priority = [
        `${basePath}/${appName}/${environment}`,
        `${basePath}/${appName}/common`,
        `${basePath}/common/${environment}`,
        `${basePath}/common/common`
    ];

    // Get all configs and perform a deep merge so that the highest priority
    // variables override the lower priority variables
    const db = admin.database();
    let returnData = {};
    for (const path of priority) {
        const ref = db.ref(path);
        const snapshot = await ref.once('value');
        const data = snapshot.val();
        returnData = _.merge(data, returnData);
    }

    return returnData;
}

module.exports = {
    getConfig
};