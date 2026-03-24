require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

const Transaction = require('./models/Transaction');

app.post('/stkpush', async (req,res)=>{
    const { phone, amount } = req.body;

    const tx = await Transaction.create({
        phone,
        amount,
        status: "pending"
    });

    // Simulated STK push (replace with Safaricom API)
    setTimeout(async ()=>{
        tx.status = "success";
        await tx.save();
    }, 5000);

    res.json({ success:true, id: tx._id });
});

app.get('/status/:id', async (req,res)=>{
    const tx = await Transaction.findById(req.params.id);
    res.json(tx);
});

app.get('/transactions', async (req,res)=>{
    const txs = await Transaction.find().sort({createdAt:-1});
    res.json(txs);
});

app.listen(3000, ()=>console.log("Server running on 3000"));
