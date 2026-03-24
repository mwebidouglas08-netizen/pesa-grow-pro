const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    phone: String,
    amount: Number,
    status: { type: String, default: "pending" }
},{ timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
