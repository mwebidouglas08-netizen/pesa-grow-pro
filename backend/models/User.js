const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phone: String,
    password: String,
    balance: { type: Number, default: 0 },
    profit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
