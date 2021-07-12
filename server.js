require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const PORT = process.env.PORT || 4003; 
const expresslayouts = require("express-ejs-layouts");
var flash = require('connect-flash');
const app = express();
app.use(expresslayouts);


// Look for static files here in this folder
app.use(express.static("public"));

// 1- Import Routes
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const profileRoute = require('./routes/profile');
const cityRoute = require('./routes/city');

// Express Session and Passport
let session = require('express-session');
let passport = require('./helper/ppConfig');

app.use(session({
  secret: process.env.SECRET, //used for sesstion managment - check sesstion id secret key, if its valid or end sesstion 
  saveUninitialized: true, //warinigs
  resave: false,//warinigs
  cookie: { maxAge: 36000000000000000000 } //sesstion duration time
}))

// Initialize Passport and Passport Session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Sharing information to other pages - middleware
app.use(function (req, res, next) {
  res.locals.currentUser = req.user; // locals means share the info
  res.locals.alerts = req.flash();
  next();
})

// 2-  Mount Routes - include index.js to browser
app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', postRoute);
app.use('/', profileRoute);
app.use('/city/', cityRoute);



app.set("view engine", "ejs");

mongoose.connect(
  process.env.mongoBDURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongodb connected seccessfully!!!");
  }
);


app.listen(PORT, () => {
  console.log(`✅ PORT: ${PORT} 🌟`)
})