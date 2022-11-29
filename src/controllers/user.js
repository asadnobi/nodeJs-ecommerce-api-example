const mongoose = require('mongoose');
const UserModel = require("../models/user");
const toEncrypt = require('../utilities/toEncrypt');
const toDecrypt = require('../utilities/toDecrypt');
const moveFile = require('../utilities/moveFile');
const deleteAllFile = require('../utilities/deleteAllFile');

// for GET User list data
const getUserList = async (req, res, next) => {
    try {
        const numOfusers = await UserModel.find().count();
        const usersArray = await UserModel.find()
        .select('-password -token -createdAt -updatedAt -__v')
        .limit(req.searchLimit).skip(req.searchSkip);
        const response = {
            status: true,
            datatype: 'All Users',
            numOfResults: usersArray.length,
            lastPage: Math.ceil(numOfusers / req.searchLimit),
            page: req.searchPage,
            data: usersArray
        }
        if (response.lastPage == 0) return res.status(204).send({status: false, msg: "Maybe User was not found!"});
        if (response.page > response.lastPage) return res.status(204).send({status: false, msg: `You've reached the last page, LAST PAGE: ${response.lastPage}`});
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

// for POST a user data
const postUser = async (req, res, next) => {
    const {password, email} = req.body;
    const encryptedKey = toEncrypt(password);
    if(!password) return res.status(400).send({status: false, msg: "Please enter your password"});
    try {
        const exitUser = await UserModel.findOne({ email });
        if(exitUser) return res.status(409).send({status: false, msg: "User Already Exits!"});   
        const newUser = new UserModel({...req.body, profile_img: req.file.filename, password: encryptedKey});
        const result = await newUser.save();
        if(!result) return res.status(204).send({status: false, msg: "Maybe User was not found!"});  
        // moving user image temp to folder
        if(req.file) {
            moveFile('./'+req.file.destination+'/'+req.file.filename, './public/images/profiles/');
        }
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}
  
// for GET a user data
const getUser = async (req, res, next) => {
    const _id = req.params.userId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send({status: false, msg: "Could not get User with id=" + _id});
    }
    try {
        const result = await UserModel.findById(_id)
        .select('-password -token -createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for UPDATE a user data
const updateUser = async (req, res, next) => {
    const _id = req.params.userId;
    const payload = req.body;
    if(payload.password) {
        const encryptedKey = toEncrypt(payload.password);
        payload.password = encryptedKey;
    }
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send({status: false, msg: "Could not update User with id=" + _id});
    }
    try {
        const user = await UserModel.findById(_id).select('-_id -token -createdAt -updatedAt -__v');
        if(!user) return res.status(400).send({status: false, msg: "Could not update User with id=" + _id});
        const result = await UserModel.findByIdAndUpdate(_id, payload, {new:true})
        .select('-password -token -createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for DELETE a user data
const deleteUser = async(req, res, next) => {
    const _id = req.params.userId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send({status: false, msg: "Could not delete User with id=" + _id});
    }
    try {
        const result = await UserModel.findByIdAndRemove(_id)
        .select('-password -token -createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, msg: "User was deleted successfully!"});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for DELETE all user
const deleteUserList = async(req, res, next) => {
    try {
        const result = await UserModel.deleteMany();
        if(!result) return res.status(500).send({status: false, msg: "Opps! Something went wrong"});
        // deleting all user image from folder
        deleteAllFile('./public/images/profiles/');
        res.status(200).send({status: true, msg: "All User deleted successfully!"});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for POST a user data
const registerUser = async (req, res, next) => {
    const {password, email} = req.body;
    const encryptedKey = toEncrypt(password);
    if(!password) return res.status(400).send({status: false, msg: "Please enter your password"});
    try {
        const exitUser = await UserModel.findOne({ email });
        if(exitUser) return res.status(409).send({status: false, msg: "User Already Exits!"});   
        const newUser = new UserModel({...req.body, profile_img: req.file && req.file.filename, password: encryptedKey});
        const result = await newUser.save();
        if(!result) return res.status(204).send({status: false, msg: "Maybe User was not found!"});  
        // moving user image temp to folder
        if(req.file) {
            moveFile('./'+req.file.destination+'/'+req.file.filename, './public/images/profiles/');
        }
        return next();
    } catch (err) {
        res.status(500).send(err);
    }
}

// for login user data
const loginUser = async(req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({status: false, msg: "Please enter valid credential data"});
    try {
        const result = await UserModel.findOne({ email });
        if(!result) return res.status(404).send({status: false, msg: "User is not exist!"});
        const decryptedKey = toDecrypt(result.password);
        if(password !== decryptedKey) return res.status(400).send({status: false, msg: "Please enter valid credentials"});
        next();
    } catch (err) {
        res.status(500).send(err);
    }
}


// for GET a user data search query
const queryUser = async (req, res, next) => {
    const { _id, email, mobile_no } = req.query;
    let searchQuery = {};
    if(_id) searchQuery._id = _id;
    if(email) searchQuery.email = email;
    if(mobile_no) searchQuery.mobile_no = mobile_no;
    if(!searchQuery) return res.status(400).send({status: false, msg: "Please enter valid search query params"});
    try {
        const result = await UserModel.findOne(searchQuery)
        .select('-password -token -createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}




module.exports = {
    getUserList, 
    postUser, 
    getUser, 
    updateUser, 
    deleteUser, 
    deleteUserList, 
    registerUser, 
    loginUser, 
    queryUser
}