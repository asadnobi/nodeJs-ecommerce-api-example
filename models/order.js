const mongoose = require('mongoose');
const { Schema } = mongoose;


const policySchema = new Schema({
    takeaway: String,
    min_amount: Number,
    takeaway_time: Number
})

const couponSchema = new Schema({
    _id: String,
    type: String,
    code: String,
    title: String,
    msg: String,
    amount: Number,
    rate: Number,
    dish: Array
})

const promoSchema = new Schema({
    promoType: String,
    _id: String,
    title: String,
    description: String,
    terms_and_condition: String,
    image: String,
    start_date: String,
    end_date: String,
    start_time: String,
    end_time: String,
    available_days: [Number],
    eligible_amount: Number,
    eligible_for: Number,
    eligible_payment_methods: Number,
    type: Number,
    amount: Number,
    rate: Number,
    is_active: Boolean,
    is_default: Boolean,
    is_first_order: Boolean,
    platform: Number,
})

const takewayAddressSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    mobile_no: {type: String, required: true},
    driver_instruction: {type: String},
    distance: {type: Number, required: true},
    duration: {type: Number, required: true},
    charge: {type: Number, required: true},
    address: {
        line1: {type: String, required: true},
        line2: {type: String},
        city: {type: String, required: true},
        postcode: {type: String, required: true},
        country: {type: String, required: true}
    }
})

const orderSchema = new Schema({  
  policy: policySchema | null,
  coupon: couponSchema | null,
  promo: promoSchema | null,
  payment: {type: String, required: true},
  paymentStatus: {type: Boolean, default: false},
  notes: String | null,
  address: takewayAddressSchema | null,
  orderItems: [],
  vatAmount:{type: Number, default: 0},
  vatType: {type: String, default: 'included'},
  tips:{type: Number, default: 0},
  serviceCharge:{type: Number, default: 0},
  bagCharge:{type: Number, default: 0},
  subTotal:{type: Number, required: true},
  total:{type: Number, required: true},
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, immutable: true, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}, { versionKey: false })

orderSchema.pre('save', () => {
    this.updatedAt = Date.now();
})

module.exports = mongoose.model('Orders', orderSchema);