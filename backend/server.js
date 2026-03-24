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
setInterval(async ()=>{
    const users = await User.find();

    for (let user of users){
        if(user.balance > 0){
            let profit = user.balance * 0.02; // 2% daily
            user.balance += profit;
            user.profit += profit;
            await user.save();
        }
    }

    console.log("Profits updated...");
}, 60000); // every 1 min (simulate daily)
const plans = [
    { name: "Starter", min: 1000, rate: 0.02 },
    { name: "Pro", min: 5000, rate: 0.05 },
    { name: "VIP", min: 10000, rate: 0.1 }
];

app.get('/plans', (req,res)=>{
    res.json(plans);
});
let currentUser = null;

async function login(){
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ phone, password })
    });

    const data = await res.json();
    currentUser = data;

    loadDashboard();
}
async function loadDashboard(){
    const res = await fetch('/user/' + currentUser.phone);
    const user = await res.json();

    document.getElementById('balance').innerText = "KES " + user.balance;
    document.getElementById('profit').innerText = "KES " + user.profit;
}
