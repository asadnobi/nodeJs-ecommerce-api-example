const mongoose = require('mongoose');
const SessionModel = require("../models/session");

// for POST a session data
const createToken = async (req, res, next) => {
  const { userId, sessionToken, expires } = req.body;
  console.log(req.body)
  if(!userId || !sessionToken || !expires) return res.status(400).send({status: false, msg: "please provided valid data"});
  const findSession = await SessionModel.findOne({ userId })
  if(findSession) {
    const result = await SessionModel.findByIdAndUpdate(
      findSession._id.toString(), {sessionToken, expires}, {new:true}
    ).select('-createdAt -updatedAt -__v')
    if(!result) return res.status(500).send({status: false, msg: "Something wrong"});
    return res.status(200).send({status: true, data: result});   
  }
  const newSession = new SessionModel({ userId, sessionToken, expires });
  const result = await newSession.save().select('-createdAt -updatedAt -__v')
  if(!result) return res.status(500).send({status: false, msg: "Something wrong"});
  return res.status(200).send({status: true, data: result});
}

const getToken = async (req, res, next) => {
  const _id = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({status: false, msg: "Could not get session with id=" + _id});
  }
  try {
    const findSession = await SessionModel.findOne({ _id });
    if(!findSession) return res.status(204).send({status: false, msg: "Maybe Session was not found!"});
    return res.status(200).send({status: true, data: findSession});   
  } catch (err) {
    return res.status(500).send(err);
  }
}

const updateToken = async (req, res, next) => {
  const _id = req.params.id;
  const { sessionToken, expires } = req.body;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({status: false, msg: "Could not get session with id=" + _id});
  }
  if(!sessionToken || !expires) return res.status(400).send({status: false, msg: "please provided valid data"});
  const result = await SessionModel.findByIdAndUpdate(
    _id, {sessionToken, expires}, {new:true}
  );
  if(!result) return res.status(500).send({status: false, msg: "Something wrong"});
  return res.status(200).send({status: true, data: result});   
}

const deleteToken = async (req, res, next) => {
  const _id = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({status: false, msg: "Could not delete Session with id=" + _id});
  }
  try {
    const result = await SessionModel.findByIdAndRemove(_id);
    if(!result) return res.status(204).send({status: false, msg: "Maybe Session was not found!"});
    res.status(200).send({status: true, msg: "Session was deleted successfully!"});
  } catch (err) {
    res.status(500).send(err);
  }
}



module.exports = {
  createToken, getToken, updateToken, deleteToken,
}