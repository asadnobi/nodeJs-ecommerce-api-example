const mongoose = require('mongoose');
const ProductModel = require("../models/product");
const moveFile = require('../utilities/moveFile');
const deleteAllFile = require('../utilities/deleteAllFile');
const md5 = require('md5');


// for GET Product list data
const product_get_all_data = async (req, res, next) => {
    try {
        const numOfproducts = await ProductModel.find().count();
        const productsArray = await ProductModel.find()
        .select('-createdAt -updatedAt -__v')
        .limit(req.searchLimit).skip(req.searchSkip);
        const response = {
            status: true,
            datatype: 'All Product',
            numOfResults: productsArray.length,
            lastPage: Math.ceil(numOfproducts / req.searchLimit),
            page: req.searchPage,
            data: productsArray
        }
        if (response.lastPage == 0) return res.status(204).send({status: false, msg: "Maybe Product was not found!"});
        if (response.page > response.lastPage) return res.status(204).send({status: false, msg: `You've reached the last page, LAST PAGE: ${response.lastPage}`});
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
}

// for POST a product data
const product_post_data = async (req, res, next) => {
    // genarate product_id
    const product_id = (new Date()).getTime().toString(16)
    // genarate sku
    const sku = md5(req.body.title + req.body.price);
    // get uploaded product images
    productImages = [];
    if(req.files) {
        for (const file of req.files) {
            productImages.push(file.filename)
        }
    }
    try {
        const exitproduct = await ProductModel.findOne({ sku });
        if(exitproduct) return res.status(409).send({status: false, msg: "Product Already Exits!"});   
        const newproduct = new ProductModel({...req.body, product_id, images: productImages, sku});
        const result = await newproduct.save();
        if(!result) return res.status(204).send({status: false, msg: "Maybe product was not found!"});  
        // moving product image temp to folder
        if(req.files) {
            for (const file of req.files) {
                moveFile('./'+file.destination+'/'+file.filename, './public/images/products/'+result.product_id);
            }
        }
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}
  
// for GET a product data
const product_get_data = async (req, res, next) => {
    const _id = req.params.productId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send({status: false, msg: "Could not get product with id=" + _id});
    }
    try {
        const result = await ProductModel.findById(_id)
        .select('-createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe product was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for UPDATE a product data
const product_update_data = async (req, res, next) => {
    const _id = req.params.productId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send({status: false, msg: "Could not update product with id=" + _id});
    }
    try {
        const result = await ProductModel.findByIdAndUpdate(_id, req.body, {new:true})
        .select('-createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe product was not found!"});
        res.status(200).send({status: true, data: result});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for DELETE a product data
const product_delete_data = async(req, res, next) => {
    const _id = req.params.productId;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send({status: false, msg: "Could not delete product with id=" + _id});
    }
    try {
        const result = await ProductModel.findByIdAndRemove(_id)
        .select('-createdAt -updatedAt -__v');
        if(!result) return res.status(204).send({status: false, msg: "Maybe product was not found!"});
        // deleting all product image from folder
        deleteAllFile('./public/images/products/'+result.product_id);
        res.status(200).send({status: true, msg: "product was deleted successfully!"});
    } catch (err) {
        res.status(500).send(err);
    }
}

// for DELETE all product
const all_product_delete = async(req, res, next) => {
    try {
        const result = await ProductModel.deleteMany();
        if(!result) return res.status(500).send({status: false, msg: "Opps! Something went wrong"});
        // deleting all product image from folder
        deleteAllFile('./public/images/products/');
        res.status(200).send({status: true, msg: "All product deleted successfully!"});
    } catch (err) {
        res.status(500).send(err);
    }
}



module.exports = {
    product_get_all_data, 
    product_post_data, 
    product_get_data, 
    product_update_data, 
    product_delete_data, 
    all_product_delete
}