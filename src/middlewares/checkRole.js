const SessionModel = require("../models/session");
const jwt = require('jsonwebtoken');

const checkRole = async (req, res, next) => {
    var sessionToken = req.headers['x-access-token'];
    if (!sessionToken) return res.status(400).send({status: false, msg: "No token provided."});
    try {
        const foundKey = await SessionModel.findOne({ sessionToken }).populate('userId', 'user_role')
        if (!foundKey) return res.status(406).send({status: false, msg: "Please provide a valid token"});
        const {err, decoded} = await jwt.verify(token, process.env.TOKEN_KEY);
        if(err) return res.status(406).send({ status: false, msg: (err.message ? err.message : 'Failed to authenticate token.') });
        if(!foundKey.userId.user_role || foundKey.userId.user_role >= 1) return res.status(401).send({status: false, msg: "Unathentication error"});
        return next();
    } catch (err) {
        return res.status(500).send(err);
    }
}

module.exports = checkRole;