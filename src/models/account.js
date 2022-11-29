const mongoose = require('mongoose');
const { Schema } = mongoose;


const accountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  type: {type: String, default: null},
  provider: {type: String, default: null},
  providerAccountId: {type: String, default: null},
  refresh_token: {type: String, default: null},
  access_token: {type: String, default: null},
  expires_at: {type: Number, default: null},
  token_type: {type: String, default: null},
  scope: {type: String, default: null},
  id_token: {type: String, default: null},
  session_state: {type: String, default: null},
  oauth_token_secret: {type: String, default: null},
  oauth_token: {type: String, default: null},
  createdAt: { type: Date, immutable: true, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
})


accountSchema.pre('save', () => {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Accounts', accountSchema);