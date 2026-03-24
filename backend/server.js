require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

// ✅ Model
const Transaction = require('./models/Transaction');

// ✅ Serve frontend (IMPORTANT FOR RAILWAY)
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Routes

app.post('/stkpush', async (req,res)=>{
    const { phone, amount } = req.body;

    const tx = await Transaction.create({
        phone,
        amount,
        status: "pending"
    });

    // Simulated success
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

// ✅ Default route (IMPORTANT)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Railway PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
const User = require('./models/User');

// REGISTER
app.post('/register', async (req,res)=>{
    const { phone, password } = req.body;

    const user = await User.create({ phone, password });
    res.json(user);
});

// LOGIN
app.post('/login', async (req,res)=>{
    const { phone, password } = req.body;

    const user = await User.findOne({ phone, password });

    if(!user) return res.status(400).json({ error: "Invalid login" });

    res.json(user);
});
