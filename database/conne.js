const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/expense-tracker")
.then( () =>{
    console.log("connection is sucsefuliy");
})
.catch( (e) =>{
    console.log("No connection");
})

module.exports= mongoose;