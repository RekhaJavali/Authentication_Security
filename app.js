//jshint esversion:6
require('dotenv').config(); //should be at top 

const express = require("express");
const app = express();

const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt =  require("mongoose-encryption"); //to encrypt password in db
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended:true}));
// console.log(process.env.SECRET);

app.use(express.static("public"));
app.set("view engine", 'ejs');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Rekha:Rekha13@cluster0.uihvcdf.mongodb.net/userDB", function(err){
    if(err) console.log("can't connect to db", err);
    else console.log("db connected");
})

const userSchema =  new mongoose.Schema({
    email:String,
    password: String
});


// const secret = "MynameisRekhaGKfromDavanagere"; //in env
// userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] }); // removed for hasing md5level3

const User = mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});



app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser =  new User({
            email: req.body.username,
            // password: md5(req.body.password) //level3 security
            password: hash //level4 sec
        });
        newUser.save(function(err){
            if(err) console.log(err);
            else res.render("secrets");
        });
        console.log(newUser.email);
        console.log(newUser.password);
    });


    
    
});

app.post("/login", function(req, res){
    const username =  req.body.username;
    // const password =  md5(req.body.password);//level3 encryption
    const password = req.body.password //level4
    console.log(username);
    console.log(password);

    User.findOne({email:username},function(err, founduser){
        if(err) 
            console.log(err);
        else{
            if(founduser){
                // if(founduser.password === password){ //level3 commenting to implement level4
                bcrypt.compare(password, founduser.password, function(err, result) {
                    if(result === true)
                        res.render("secrets");
                });
                    
                }
                
            }
        });
    });


app.listen("3000", function(){
    console.log("server on 3000 port");
});