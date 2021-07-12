const express = require('express')
const router = express.Router()
const isLoggedIn = require("../helper/isLoggedin")
const Post = require("../models/Post");


// City Route
router.get('city/index', (req, res) => {
    Instractor.find()
        .then(cities => {
            res.render('city/index', { cities })
        })
        .catch(err => res.send(err))

})

// City Add Route - GET
router.get('/city/add', (req, res) => {
    res.render('city/add')
})

// City Add Route - POST
router.post('/add', (req, res) => {
    let newCity = new City(req.body)
    newCity.save()
        .then(() => res.redirect('/manage'))
        .catch(err => res.send(err))
})


// City Show Route
router.get('/:city', (req, res) => {
    Post.find({ city: { $ne: req.params.city } })
        .then(city => {
            res.render("home/city", { city });
        })
        .catch(err => {
            console.log(err);
        })
})


module.exports = router;