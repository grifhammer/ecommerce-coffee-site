var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user)
  res.render('index', { user: req.user });
});

router.get('/register', function (req, res, next){
    res.render('register');
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            console.log(account);
            return res.render('register', { account : account, err: err });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.username = req.body.username;
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res, next){
    res.render('login');
});

router.post('/login', passport.authenticate('local'), function (req, res){
    req.session,username = req.body.username;
    res.redirect('/')
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
