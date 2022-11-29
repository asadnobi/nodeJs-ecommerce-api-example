const SessionModel = require("../models/session");
const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
    const sessionToken = req.headers['x-access-token'];
    if (!sessionToken) return res.status(401).send({status: false, msg: "No token provided."});
    try {
        const foundKey = await SessionModel.findOne({ sessionToken });
        if (!foundKey) return res.status(404).send({status: false, msg: "Please provide a valid token"});
        const {err, decoded} = await jwt.verify(token, process.env.TOKEN_KEY);
        if(err) return res.status(403).send({ status: false, msg: (err.message ? err.message : 'Failed to authenticate token.') });
        return next();
    } catch (err) {
        return res.status(500).send(err);
    }
}

module.exports = checkToken;