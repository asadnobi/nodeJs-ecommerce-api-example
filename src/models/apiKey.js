const mongoose = require('mongoose');
const validator = require('validator');

const apiKeySchema = new mongoose.Schema({
    key: {type: String, required: true},
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email"
      }
    }
}, {
    timestamps: true
})

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey;