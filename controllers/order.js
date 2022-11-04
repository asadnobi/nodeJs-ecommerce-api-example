const mongoose = require('mongoose');
const OrderMOdel = require("../models/order");

// for GET Order list data
exports.order_get_all_data = async (req, res, next) => {
    try {
        const result = await OrderMOdel.find().populate('user', '_id first_name last_name email').exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe Order was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for POST a Order data
exports.order_post_data = async (req, res, next) => {
    const newOrder = new OrderMOdel(req.body);
    try {
        const result = await newOrder.save();
        if(!result) return res.status(404).send({status: false, msg: "Maybe Order was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}
  
// for GET a Order data
exports.order_get_data = async (req, res, next) => {
    const _id = req.params.orderId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(500).send({status: false, msg: "Could not get Order with id=" + _id});
    }
    try {
        const result = await OrderMOdel.findById(_id).exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe Order was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for UPDATE a Order data
exports.order_update_data = async (req, res, next) => {
    const _id = req.params.orderId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(500).send({status: false, msg: "Could not update Order with id=" + _id});
    }
    try {
        const result = await OrderMOdel.findByIdAndUpdate(_id, req.body, {new:true}).exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe Order was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for DELETE a Order data
exports.order_delete_data = async(req, res, next) => {
    const _id = req.params.orderId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(500).send({status: false, msg: "Could not delete Order with id=" + _id});
    }
    try {
        const result = await OrderMOdel.findByIdAndRemove(_id).exec();
        if(!result) return res.status(404).send({status: false, msg: "Maybe Order was not found!"});
        res.status(200).send({status: true, msg: "Order was deleted successfully!"});
    } catch (err) {
        res.status(500).send(err);
    }
}