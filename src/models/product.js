const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventorySchema = new Schema({
    product_id: String,
    colorname: String,
    sizename: String,
    color: String,
    size: String,
    stock: Number,
    sku: String
})

const colorSchema = new Schema({
  size_id: String,
  sizename: String,
  size: String,
  sku: String
})

const sizeSchema = new Schema({
  color_id: String,
  colorname: String,
  color: String,
  sku: String
})

const productSchema = new Schema({
  product_id: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String},
  price: {type: Number, required: true, default: 0},
  discount_price: {type: Number, default: 0},
  product_type: {type: String, default: 'regular'},
  images: [{type: String, default: null}],
  colors: [colorSchema],
  size: [sizeSchema],
  inventory: [inventorySchema],
  sku: {type: String, required: true},
  createdAt: { type: Date, immutable: true, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
})


productSchema.pre('save', () => {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Products', productSchema);