const mongoose = require('mongoose');
const AccountModel = require("../models/account");


const addAccount = async (req, res, next) => {
  const {providerAccountId, provider, userId} = req.body;
  if(!userId || !providerAccountId || !provider) return res.status(400).send({status: false, msg: "Please enter valid info"});
  try {
    const findAccount = await AccountModel.findOne({ providerAccountId, provider, userId });
    if(findAccount) return res.status(409).send({status: false, msg: "Account Already Exits!"});   
    const newAccount = new AccountModel({ ...req.body });
    const result = await newAccount.save();
    if(!result) return res.status(204).send({status: false, msg: "Maybe Account was not found!"});  
    return res.status(200).send({status: true, data: result});
  } catch (err) {
    res.status(500).send(err);
  }
}


const getAccount = async (req, res, next) => {
  const _id = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({status: false, msg: "Could not get Account with id=" + _id});
  }
  try {
    const findAccount = await AccountModel.findOne({ _id });
    if(!findAccount) return res.status(204).send({status: false, msg: "Maybe Account was not found!"});
    res.status(200).send({status: true, data: findAccount});   
  } catch (err) {
    res.status(500).send(err);
  }
}


const deleteAccount = async (req, res, next) => {
  const _id = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({status: false, msg: "Could not delete Account with id=" + _id});
  }
  try {
    const result = await AccountModel.findByIdAndRemove(_id);
    if(!result) return res.status(204).send({status: false, msg: "Maybe Account was not found!"});
    res.status(200).send({status: true, msg: "Account was deleted successfully!"});
  } catch (err) {
    res.status(500).send(err);
  }
}

const queryAccount = async (req, res, next) => {
  const { _id, providerAccountId, provider } = req.query;
  let searchQuery = {};
  if(_id) searchQuery._id = _id;
  if(providerAccountId) searchQuery.providerAccountId = providerAccountId;
  if(provider) searchQuery.provider = provider;
  if(!searchQuery) return res.status(400).send({status: false, msg: "Please enter valid search query params"});
  try {
      const result = await AccountModel.findOne(searchQuery)
      if(!result) return res.status(204).send({status: false, msg: "Maybe Account was not found!"});
      return res.status(200).send({status: true, data: result});
  } catch (err) {
      return res.status(500).send(err);
  }
}

  

module.exports = {
  addAccount, getAccount, deleteAccount, queryAccount
}