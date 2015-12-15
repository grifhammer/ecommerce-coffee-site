var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user)
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next){
    res.render('register');
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res, next){
    res.render('login');
});

router.post('/login', function (req, res, next){
    res.redirect('/')
});


module.exports = router;
