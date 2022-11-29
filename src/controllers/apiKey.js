const ApiKeyModel = require('../models/apiKey');
const sendEmail = require('../utilities/sendEmail');
const toEncrypt = require('../utilities/toEncrypt');


// for GET User list data
const getAllApiKey = async (req, res, next) => {
  try {
      const numOfusers = await ApiKeyModel.find().count();
      const keyArray = await ApiKeyModel.find()
      .select('-createdAt -updatedAt -__v')
      .limit(req.searchLimit).skip(req.searchSkip);
      const response = {
          status: true,
          datatype: 'All API Key',
          numOfResults: keyArray.length,
          lastPage: Math.ceil(numOfusers / req.searchLimit),
          page: req.searchPage,
          data: keyArray
      }
      if (response.lastPage == 0) return res.status(204).send({status: false, msg: "Maybe Key was not found!"});
      if (response.page > response.lastPage) return res.status(204).send({status: false, msg: `You've reached the last page, LAST PAGE: ${response.lastPage}`});
      res.status(200).send(response);
  } catch (err) {
      res.status(500).send(err);
  }
}


const postAnApiKey = async (req, res, next) => {
    const { email } = req.body;
    const foundApiKey = await ApiKeyModel.findOne({ email });
    if(foundApiKey) return res.status(208).send({status: false, msg: "Existing user found. Already provide you a API key"});
    const encryptedKey = toEncrypt(email);
    const newKey = new ApiKeyModel({email, key: encryptedKey});
    await newKey.save();
    const sendKeyToEmail = await sendEmail(email, 'Your API Key', `Here is your api key: ${encryptedKey}`)
    if(sendKeyToEmail) return res.status(200).send({
      status: true,
      datatype: 'API KEY REQUEST',
      msg: 'Successfully created your api key and sent it to your email'
    });
}

// for GET a user data
const getAnApiKey = async (req, res, next) => {
  const _id = req.params.keyId;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({status: false, msg: "Could not get Key with id=" + _id});
  }
  try {
      const result = await ApiKeyModel.findById(_id)
      .select('-createdAt -updatedAt -__v');
      if(!result) return res.status(204).send({status: false, msg: "Maybe Key was not found!"});
      res.status(200).send({status: true, data: result});
  } catch (err) {
      res.status(500).send(err);
  }
}

const updateAnApiKey = async (req, res, next) => {
  const _id = req.params.keyId;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({status: false, msg: "Could not update Key with id=" + _id});
  }
  try {
      const result = await ApiKeyModel.findByIdAndUpdate(_id, req.body, {new:true})
      .select('-createdAt -updatedAt -__v');
      if(!result) return res.status(204).send({status: false, msg: "Maybe Key was not found!"});
      res.status(200).send({status: true, data: result});
  } catch (err) {
      res.status(500).send(err);
  }
}



const deleteAnApiKey = async(req, res, next) => {
  const _id = req.params.keyId;
  if(!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({status: false, msg: "Could not delete Key with id=" + _id});
  }
  try {
      const result = await ApiKeyModel.findByIdAndRemove(_id);
      if(!result) return res.status(204).send({status: false, msg: "Maybe key was not found!"});
      res.status(200).send({status: true, msg: "Key was deleted successfully!"});
  } catch (err) {
      res.status(500).send(err);
  }
}

const deleteAllApiKey = async(req, res, next) => {
  try {
      const result = await ApiKeyModel.deleteMany();
      if(!result) return res.status(204).send({status: false, msg: "Opps! Something went wrong"});
      res.status(200).send({status: true, msg: "All Key deleted successfully!"});
  } catch (err) {
      res.status(500).send(err);
  }
}


module.exports = {
  getAllApiKey,
  postAnApiKey,
  getAnApiKey,
  updateAnApiKey,
  deleteAnApiKey,
  deleteAllApiKey
}