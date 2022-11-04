const mongoose = require('mongoose');
const UserMOdel = require("../models/user");

// for GET User list data
exports.user_get_all_data = async (req, res, next) => {
    try {
        const result = await UserMOdel.find().exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for POST a user data
exports.user_post_data = async (req, res, next) => {
    const newUser = new UserMOdel(req.body);
    try {
        const result = await newUser.save();
        if(!result) return res.status(404).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}
  
// for GET a user data
exports.user_get_data = async (req, res, next) => {
    const _id = req.params.userId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(500).send({status: false, msg: "Could not get User with id=" + _id});
    }
    try {
        const result = await UserMOdel.findById(_id).exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for UPDATE a user data
exports.user_update_data = async (req, res, next) => {
    const _id = req.params.userId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(500).send({status: false, msg: "Could not update User with id=" + _id});
    }
    try {
        const result = await UserMOdel.findByIdAndUpdate(_id, req.body, {new:true}).exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for DELETE a user data
exports.user_delete_data = async(req, res, next) => {
    const _id = req.params.userId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(500).send({status: false, msg: "Could not delete User with id=" + _id});
    }
    try {
        const result = await UserMOdel.findByIdAndRemove(_id).exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe User was not found!"});
        res.status(200).send({status: true, msg: "User was deleted successfully!"});
    } catch (err) {
        res.status(500).send(err);
    }
}