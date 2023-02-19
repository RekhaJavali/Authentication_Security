//jshint esversion:6

const express = require("express");
const app = express();

const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt =  require("mongoose-encryption"); //to encrypt password in db

app.use(bodyParser.urlencoded({extended:true}));

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

// const secret = "MynameisRekhaGKfromDavanagere";
// userSchema.plugin(encrypt, { secret:secret, encryptedFields: ["password"] });

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
    const newUser =  new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err) console.log(err);
        else res.render("secrets");
    });
    console.log(newUser.email);
    console.log(newUser.password);
    
});

app.post("/login", function(req, res){
    const username =  req.body.username;
    const password =  req.body.password;
    console.log(username);
    console.log(password);

    User.findOne({email:username},function(err, founduser){
        if(err) 
            console.log(err);
        else{
            if(founduser){
                if(founduser.password === password){
                    res.render("secrets");
                }
                
            }
        }
    });
});

app.listen("3000", function(){
    console.log("server on 3000 port");
});