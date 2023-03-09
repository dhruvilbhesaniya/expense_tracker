const express = require("express");
const app = express();
const port = process.env.PORT || 1000
const hbs = require("hbs");
const path = require("path");
const adminrouter = require("./router/AdminRouter");
require("./database/conne");



const static_path = path.join(__dirname,"./public");
const tempalate_path = path.join(__dirname,"./tempalate/views");
const partials_path = path.join(__dirname,"./tempalate/partials");

app.use(express.static(static_path));
app.set("view engine" ,"hbs");


app.set("views" ,tempalate_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false})); // => most imp

//router
app.use("/" , adminrouter)


app.listen(port,() =>{
    console.log(`${port} server start...`);
})