const mongoose = require('mongoose');
const { Schema } = mongoose;


const cardSchema = new Schema({
  id: String,
  type: String,
})

const addressSchema = new Schema({
  line1: {type: String, required: true},
  line2: {type: String},
  city: {type: String, required: true},
  postcode: {type: String, required: true},
  country: {type: String, required: true}
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

const userSchema = new Schema({
  first_name: {type: String, required: true, minlength: 1, maxlength: 50},
  last_name: {type: String, required: true, minlength: 1, maxlength: 50},
  phone_no: {type: String, default: null},
  mobile_no: {type: String, required: true, minlength: 2, maxlength: 50},
  email: {type: String, required: true, lowercase: true},
  isVerified: {type: Boolean, default: false},
  date_of_birth: {type: Date, default: null},
  primary_address: addressSchema | null,
  order_address: [takewayAddressSchema],
  parcel_address: [takewayAddressSchema],
  card_info: [cardSchema],
  registered_platform: {type: String, immutable: true, required: true},
  total_orders: {type: Number, default: 0},
  orderList: [{ type: Schema.Types.ObjectId, ref: 'Orders' }],
  user_role: {type: Number, default: 1},
  user_type: {type: String, immutable: true, default: () => 'normal'},
  createdAt: { type: Date, immutable: true, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}, { versionKey: false })


userSchema.pre('save', () => {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Users', userSchema);