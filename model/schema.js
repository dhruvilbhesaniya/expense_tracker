const mongoose = require("mongoose");

const addtransaction = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    Amount:{
        type:Number,
        required:true
    },
    Transaction_Type:{
        type:String,
        required:true
    },
    Message:{
        type:String,
        required:true
    },
    Account_Type:{
        type:String,
        required:true
    } 
})

const transaction_data = new mongoose.model("transaction_data" ,addtransaction);
module.exports = transaction_data;