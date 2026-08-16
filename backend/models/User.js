const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
  type: String,
  default: "",
},
address: {
  type: String,
  default: "",
},

emergencyContact: {
  type: String,
  default: "",
},
profileImage: {
  type: String,
  default: "",
},
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'worker'
  },
  resetPasswordOTP: {
    type: String,
    default: null
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// यह लाइन सबसे ज़रूरी है—चेक करें कि आपने mongoose.model() सही से लिखा है या नहीं
module.exports = mongoose.model('User', UserSchema);