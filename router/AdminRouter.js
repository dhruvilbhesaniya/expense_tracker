const express = require("express");
const app = express();
const adminrouter = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const transaction_data = require("../model/schema");
const { constants } = require("buffer");



const date = new Date();

const changeDateByMonthYear=(search) =>{

 
     let month = date.getMonth();
     let year = date.getFullYear()
  
    if (search === 'nextmonth') {
      if (month === 11) {
        month = 0;
        year++;
      } else {
        month++;
      }
      date.setMonth(month);
      date.setFullYear(year);
    } else if (search === 'prevmonth') {
      if (month === 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
      date.setMonth(month);
      date.setFullYear(year);
    }else{
        const current=new Date()
        month = current.getMonth()
        year = current.getFullYear()

        date.setMonth(month);
        date.setFullYear(year);
  }

  

    // // Set the new month and year values to the date
    // date.setMonth(month);
    // date.setFullYear(year);
    
    // Return the updated date
    return date;
  }
  
  

adminrouter.route("/transaction").get(async (req, res) => {
    
    
    var Qsearch = req.query.search;
    let Querydate = changeDateByMonthYear( Qsearch); 
    try {

            
         const responce = await transaction_data.aggregate([
                {$project:{
                    month:{$month:"$date"},
                    year:{$year:"$date"},
                    data:"$$ROOT",
                },
            },
            {
                $match:{
                    $and:[
                    {month:Querydate.getMonth()+1},{year:Querydate.getFullYear()}
                    ]
                },
            },
            {
                $group:{
                    _id:{month:"$month",year:"$year"},
                    data:{$push:"$data"},
                  
                },
            },          
          ]);

         const   belance  = await transaction_data.aggregate([
                {$project:{
                    month:{$month:"$date"},
                    year:{$year:"$date"},
                    data:"$$ROOT",
                },
            },
            {
                $match:{
                    $and:[
                    {month:Querydate.getMonth()+1},{year:Querydate.getFullYear()}
                    ]
                },
            },
            {
                $group:{
                    _id:"$data.Transaction_Type",
                    amout:{$sum:"$data.Amount"}
                },
                
            },          
          ]);            
           let Closing_balance=0; 
           responce.length <= 0 ? tdata=[] : tdata= responce[0].data

        belance.length <= 1 ? 
                   belance.length <= 0 ? 
                                        Closing_balance = 0 : belance[0]._id == "credit" ? Closing_balance = Number(belance[0].amout)   :   Closing_balance = -Number(belance[0].amout)                              
                : Closing_balance = Number(belance[0].amout) - Number( belance[1].amout)
        
        

            res.render("transaction", { date: new Date(Querydate).toDateString(),tdata:tdata,total:Closing_balance});

    } catch (e) {
        res.send(e);
    }

})



adminrouter.route("/add_transaction").get((req, res) => {
    res.render("add_transaction");
})




adminrouter.route("/add_transaction").post(async (req, res) => {
    try {
        const transaction = new transaction_data({
            date: req.body.date,
            Amount: req.body.amount,
            Transaction_Type: req.body.TraType,
            Message: req.body.message,
            Account_Type: req.body.acType
        })

        const transactionsave = await transaction.save();
        if (transactionsave) {
            res.redirect("transaction");
        }
    } catch (e) {
        res.send(e)
    }
})



adminrouter.route("/dashboard").get(async(req, res) => {
    const date=new Date();

    const m=Number( date.getMonth()+1)
    const y=Number(date.getFullYear())
    
    const   Tresponce = await transaction_data.aggregate([
        {$project:{
            month:{$month:"$date"},
            year:{$year:"$date"},
            data:"$$ROOT",
        },
    },
    {
        $match:{
            $and:[
            {month:m},{year:y}
            ]
        },
    },
       {
         $group: {_id:"$data.Transaction_Type" ,amout:{$sum:"$data.Amount"},}
       },
]);


let creditAmount = Tresponce[0].amout
let debitAmount = Tresponce[1].amout

const   Aresponce = await transaction_data.aggregate([
    {$project:{
        month:{$month:"$date"},
        year:{$year:"$date"},
        data:"$$ROOT",
    },
},

{
    $match:{
        $and:[
            {month:m},{year:y}
        ]
    },
},
{
    $group: {_id:"$data.Account_Type" ,amout:{$sum:"$data.Amount"},}
},
]);

let savingAcount =Aresponce[0].amout
let currentAccout =Aresponce[0].amout

console.log(Tresponce);
console.log(Aresponce);
res.render("dashboard" ,{Credit:creditAmount,Debit:debitAmount,Saving:savingAcount,Current:currentAccout});
    res.render("dashboard");
})


adminrouter.route("/dashboard").post(async(req, res) => {
    const serchdate=req.body.date
const[y, m, d]=serchdate.split("-")

   console.log(y);
   console.log(m);
 const   Tresponce = await transaction_data.aggregate([
    {$project:{
        month:{$month:"$date"},
        year:{$year:"$date"},
        data:"$$ROOT",
    },
},
{
    $match:{
        $and:[
            {month:Number(m)},{year:Number(y)}

        ]
    },
},
   {
     $group: {_id:"$data.Transaction_Type" ,amout:{$sum:"$data.Amount"},}
   },
]);


let creditAmount = Tresponce[0].amout
let debitAmount = Tresponce[1].amout

const   Aresponce = await transaction_data.aggregate([
{$project:{
    month:{$month:"$date"},
    year:{$year:"$date"},
    data:"$$ROOT",
},
},

{
$match:{
    $and:[
        {month:Number(m)},{year:Number(y)}
    ]
},
},
{
$group: {_id:"$data.Account_Type" ,amout:{$sum:"$data.Amount"},}
},
]);

let savingAcount =Aresponce[0].amout
let currentAccout =Aresponce[1].amout




res.render("dashboard" ,{Credit:creditAmount,Debit:debitAmount,Saving:savingAcount,Current:currentAccout})
    res.render("dashboard");
})

module.exports = adminrouter;