const mongoose = require('mongoose');
const { Schema } = mongoose;


const sessionSchema = new Schema({
  expires: {type: Date, default: null},
  sessionToken: {type: String, default: null},
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, immutable: true, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
})


sessionSchema.pre('save', () => {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Sessions', sessionSchema);