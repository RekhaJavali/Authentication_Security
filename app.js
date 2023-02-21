//jshint esversion:6
require('dotenv').config(); //should be at top 

const express = require("express");
const app = express();

const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt =  require("mongoose-encryption"); //to encrypt password in db
// const md5 = require("md5"); //level3
// const bcrypt = require("bcrypt"); //level4
// const saltRounds = 10;

//order of the cose is imp on passport session code
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.use(bodyParser.urlencoded({extended:true}));
// console.log(process.env.SECRET);

app.use(express.static("public"));
app.set("view engine", 'ejs');


app.use(session({
    secret: 'My name is rekha',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

  app.use(passport.initialize());
  app.use(passport.session());



mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Rekha:Rekha13@cluster0.uihvcdf.mongodb.net/userDB", function(err){
    if(err) console.log("can't connect to db", err);
    else console.log("db connected");
})

const userSchema =  new mongoose.Schema({
    email:String,
    password: String
});

userSchema.plugin(passportLocalMongoose); //passportjs
// const secret = "MynameisRekhaGKfromDavanagere"; //in env
// userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] }); // removed for hasing md5level3

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/secrets", function(req, res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout(function(err) {
        if (err) { return next(err);}
        res.redirect("/");
        });
});

app.post("/register", function(req,res){
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        //here db stres username overwrites name email
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req,res){
    const user = new User({
        username:req.body.username, //this is username instead of email
        password:req.body.password
    });
    //passport method login
    req.login(user, function(err){
        if(err){
             console.log(err);
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});
/*
//commented post - login and register for passport.js implementation
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
*/

app.listen("3000", function(){
    console.log("server on 3000 port");
});