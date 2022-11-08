const UserModel = require("../models/user");
const jwt = require('jsonwebtoken');

const checkRole = async (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({status: false, msg: "No token provided."});
    const foundKey = await UserModel.findOne({ token });
    if (!foundKey) return res.status(404).send({status: false, msg: "Please provide a valid token"});
    await jwt.verify(token, process.env.TOKEN_KEY, (err) => {
        if(err) return res.status(500).send({ status: false, msg: (err.message ? err.message : 'Failed to authenticate token.') });
    });
    if(!foundKey.user_role || foundKey.user_role >= 1) return res.status(401).send({status: false, msg: "Unathentication error"});
    next();
}

module.exports = checkRole;