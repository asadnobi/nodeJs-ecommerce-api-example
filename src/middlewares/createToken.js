const SessionModel = require("../models/session");
const UserModel = require("../models/user");
const jwt = require('jsonwebtoken');

const createToken = async (req, res, next) => {
  const { email } = req.body;
  if(!email) return res.status(400).send({status: false, msg: "Invalid email"});
  const findUser = await UserModel.findOne({ email })
  .select('-password -createdAt -updatedAt -__v');
  if(!findUser) return res.status(204).send({status: false, msg: "Maybe User was not found!"});
  // token
  const expires = new Date(new Date().setHours(new Date().getHours() + 4));
  const sessionToken = jwt.sign(
    {userId: findUser._id, email: findUser.email},
    process.env.TOKEN_KEY,
    {expiresIn: expires.getTime()}
  );
  // save Session in db
  const findSession = await SessionModel.findOne({ userId: findUser._id.toString() })
  if(findSession) {
    const result = await SessionModel.findByIdAndUpdate(
      findSession._id.toString(), 
      {sessionToken, expires}, 
      {new:true}
    )
    if(!result) return res.status(204).send({status: false, msg: "Something wrong"});
    return res.status(200).send({status: true, data: findUser, token: result.sessionToken});
  }
  const newSession = new SessionModel({userId: findUser._id, sessionToken, expires});
  const result = await newSession.save();
  if(!result) return res.status(204).send({status: false, msg: "Something wrong"});
  return res.status(200).send({status: true, data: findUser, token: result.sessionToken});
}

module.exports = createToken;