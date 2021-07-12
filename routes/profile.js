const express = require("express");
const router = express.Router(); 
const moment = require('moment');
const bcrypt = require("bcrypt");
const salt = 10;
var methodOverride = require('method-override');
const isLoggedIn = require("../helper/isLoggedIn");

// Use method override
router.use(methodOverride('_method'));

// Import Model
const User = require("../models/User");
const Post = require("../models/Post");

// Route to user profile
router.get('/user/profile', (req, res) => {
    console.log(req.user._id)
    User.findById(req.user._id)
        .then(user => {
            res.render("user/profile", { user, moment });
        })
        .catch(err => {
            console.log(err);
        });
});


// Change Password Route - GET
router.get('/user/edit', isLoggedIn, (req, res) => {
    //console.log(req.user._id)
    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                return res.redirect("/");
            }
            res.render("user/edit", { user, moment });
        })
        .catch(err => {
            console.log(err);
        });
    //res.redirect("/");

})



// Edit Profile Route - POST
router.post("/user/profile", (req, res) => {
    let query = { _id: req.body.id }
    var data = {
        $set: req.body
    }
    console.log(data)
    User.findByIdAndUpdate(query, data, { new: true })
        .then(() => {
            res.redirect("/user/profile")
            console.log(query)
        })
        .catch(err => {
            console.log(err)
        })
})


// Change Password Route - POST
router.post('/user/changepassword', (req, res) => {
    console.log("test user")
    console.log(req.body.id)
    console.log(req.body.password + "password test")
    let hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash);
    const userPassword = User.findByIdAndUpdate((req.body.id), { password: hash }, { new: true })
        .then(user => {
            res.render("user/profile", { user });
        })
        .catch(err => {
            console.log(err);
        });
});


// POST - ProfilePost
router.get('/post/profilePost', isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate("posts")
        .then(user => {
            res.render("post/profilePost", { user });
        })
        .catch(err => {
            console.log(err);
        })
})



module.exports = router;