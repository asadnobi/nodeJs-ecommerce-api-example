const ApiKeyModel = require('../models/apiKey');
const toEncrypt = require('../utilities/toEncrypt');

const checkApiKey = async (req, res, next) => {
    const { apikey } = req.query;
    if (!apikey) return res.status(400).send({status: false, msg: "Please provide a valid API key"});
    const encryptedKey = toEncrypt(apikey);
    const foundKey = await ApiKeyModel.findOne({ key: encryptedKey })
    if (!foundKey) return res.status(400).send({status: false, msg: "Please provide a valid API key"});
    next();
}

module.exports = checkApiKey;