const UserModel = require("../models/user");
const jwt = require('jsonwebtoken');

const createToken = async (req, res, next) => {
    const {email} = req.body;
    if(!email) return res.status(500).send({status: false, msg: "Invalid email"});
    const findUser = await UserModel.findOne({ email })
    .select('-password -createdAt -updatedAt -__v');
    if(!findUser) return res.status(404).send({status: false, msg: "Maybe User was not found!"});
    // Create token
    const token = jwt.sign(
        {user_id: findUser._id, email: findUser.email},
        process.env.TOKEN_KEY,
        {expiresIn: "3h"}
    );
    // save user token
    findUser.token = token;
    const saveUser = await findUser.save();
    if(!saveUser) return res.status(400).send({status: false, msg: "Something wrong"});
    
    res.status(200).send({status: true, data: saveUser});
}

module.exports = createToken;