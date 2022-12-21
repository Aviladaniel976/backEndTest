const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const { first } = require("lodash");
mongoose.connect("mongodb://0.0.0.0:27017/signPage");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/'));
mongoose.set('strictQuery', false);


const userSchema = new mongoose.Schema({
    userEmail: String,
    userName: String,
    userPassword: String,
});

const Data = mongoose.model("Data", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/signup", function(req, res){
    res.render("signup")
});

app.get("/signin", function(req, res){
    res.render("signin");
});

app.get("/success", function(req, res){
    res.render("success")
});

app.get("/search", function(req, res){
    res.redirect("/signin");
});

app.get("/home", function(req, res){
    res.redirect("/");
});

app.get("/users", function(req, res){
    Data.find(function(err,postFound){
        res.render("users", {
          posts: postFound
          });
    });
});

app.post("/signup", function(req, res){
    res.redirect("/signup");
});

app.post("/signin", function(req, res){
    res.redirect("/signin");
});

app.post("/search", function(req, res){
    var email = req.body.email
    Data.findOne({userEmail:email}, function(err, emailFound){
        if(!emailFound){
            res.redirect("/signup")
        }else{
            res.render("success", {
                fullName: emailFound.userName,
                contact: emailFound.userEmail,
                userId: emailFound._id,
            })
        }
    })
});

app.post("/add", function(req, res){
    res.redirect("/signin")
    const newUser = new Data({
        userEmail: req.body.email,
        userName: req.body.firstName + " " + req.body.lastName,
        userPassword: req.body.password,
    });
    newUser.save();
});

app.post("/delete", function(req, res){
    res.redirect("/");
    const IdItem = req.body.id;
    Data.findByIdAndRemove(IdItem, function(err){
        if(!err){
            console.log("Successfully deleted")
        };
    });
    
});


app.listen(3000, function(){
    console.log("Server is running on port 3000.");
})