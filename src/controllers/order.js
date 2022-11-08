const mongoose = require('mongoose');
const OrderMOdel = require("../models/order");

// for GET Order list data
exports.order_get_all_data = async (req, res, next) => {
    try {
        const numOforders = await OrderMOdel.find().count();
        const ordersArray = await OrderMOdel.find()
        .populate('user', '_id first_name last_name email')
        .select('-createdAt -updatedAt -__v')
        .limit(req.searchLimit).skip(req.searchSkip);
        const response = {
            status: true,
            datatype: 'All Orders',
            numOfResults: ordersArray.length,
            lastPage: Math.ceil(numOforders / req.searchLimit),
            page: req.searchPage,
            data: ordersArray
        }
        if (response.lastPage == 0) return res.status(404).send({status: false, msg: "Maybe Order was not found!"});
        if (response.page > response.lastPage) return res.status(404).send({status: false, msg: `You've reached the last page, LAST PAGE: ${response.lastPage}`});
        res.status(200).send(response);
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