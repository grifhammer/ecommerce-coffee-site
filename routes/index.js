var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.username)
    res.render('index', { user: req.session.username });
});

router.get('/register', function (req, res, next){
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account, err: err });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.username = req.body.username;
            res.render('choices');
        });
    });
});

router.get('/login', function (req, res, next){
    if(req.session.username){
        res.redirect('/');
    }
    if(req.query.failedlogin){
        res.render('login', {failed: "Your username or password is incorrect"});
    }

    //user hasnt logged in and hasnt failed any logins
    res.render('login', {});
});

router.post('/login', function (req, res, next){
    passport.authenticate('local', function (err, user, info){
        if(err){
            return next(err);
        }

        if(!user){
            return res.redirect('login?failedlogin=1');
        }
        if(user){
            console.log(user);
            passport.serializeUser(function (user, done){
                done(null, user);
            });
            passport.deserializeUser(function (obj, done){
                done(null, obj);
            });
            req.session.username = user.username;
            console.log(req.session.username);
        }
        return res.redirect('/')

    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


router.get('/choices', function (req, res, next){
    //CHeck to see if user is logged in
    if(!req.session.username){
        res.redirect('/login');
    }
    else{
        //Check to see if they have preferences already

        res.render('choices');
    }
});

module.exports = router;
