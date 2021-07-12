const express = require("express");
const router = express.Router(); // Package 
const moment = require('moment');
var methodOverride = require('method-override');
const isLoggedIn = require("../helper/isLoggedIn");

// Use method override
router.use(methodOverride('_method'));

// Import Model
const Post = require("../models/Post");
const User = require("../models/User");
const { request } = require("express");

// 1- FORM: Grab the form data from the form 
router.use(express.urlencoded({ extended: true }));


// POST Add Route - GET
router.get("/post/add", isLoggedIn, (req, res) => {
    User.findById(req.user._id).then(user => {
        res.render("post/add", { user });
    })
})

// 2- FORM:  HTTP POST - To post the Post
// HTTP POST - To add post
router.post("/post/add", isLoggedIn, (req, res) => {
    let post = new Post(req.body);
    post.save()
        .then((post) => {
            User.findByIdAndUpdate(req.user._id, { $push: { posts: post } })
                .then(() => {
                    res.redirect("/post/index");
                })
                .catch((err) => {
                    console.log(err);
                    res.send("ERROR!!!");
                })
        })
});




// HTTP GET - Post Index
router.get("/post/index", (req, res) => {
    Post.find().populate(({ path: 'User' }))
        .then(post => {
            res.render("post/index", { post, moment });
        })
        .catch(err => {
            console.log(err);
            res.send("ERROR!!!");
        })

})


// HTTP GET - GET Manage
router.get('/manage', isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate("posts")
        .then(user => {
            res.render("post/manage", { user });
        })
        .catch(err => {
            console.log(err);
        })
})



//POST - EDIT
router.post("/post/edit", (req, res) => {
    Post.findById(req.query.id)
        .then(post => {
            User.find()
                .then(user => {
                    res.render("post/edit", { post: post, moment: moment, user })
                })
        })
        .catch(err => {
            console.log(err)
        })
})


// Edit Add Route - POST
router.put("/post/edit", (req, res) => {
    let query = { _id: req.query.id }
    var data = {
        $set: req.body
    }

    Post.findByIdAndUpdate(query, data, { useFindAndModify: false })
        .then((post) => {
            User.findByIdAndUpdate(post.user,
                { $pull: { user: post._id } })
                .then(() => {
                    User.findByIdAndUpdate(req.body.user,
                        { $addToSet: { post: post } })
                        .then(() => {

                            res.redirect('/manage')
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })

})


// Delete Route 
router.delete("/post/delete", (req, res) => {
    Post.findByIdAndDelete(req.query.id)
        .then(() => {
            res.redirect("/post/index");
        })
        .catch(err => {
            console.log(err);
        })
})


/// About us route
router.get("/aboutus", (req, res) => {
    res.render("home/aboutus")
})


// Detail Route - GET
router.get("/post/detail", (req, res) => {
    console.log(req.query.id);
    Post.findById(req.query.id)
    .then(post => {
        res.render("post/detail", {post : post , moment});
    })
    .catch(err => {
        console.log(err);
    })
})


module.exports = router;