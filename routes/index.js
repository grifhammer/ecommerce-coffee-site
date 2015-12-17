var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {   user: req.session.username,
                            active: 'welcome' });
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
    //Check to see if user is logged in
    if(!req.session.username){
        res.redirect('/login');
    }
    else{
        //Check to see if they have preferences already
        Account.findOne({username: req.session.username},
            function (err, doc){
                var currGrind = doc.grind ? doc.grind : undefined
                var currPounds = doc.pounds ? doc.pounds : undefined
                var currFrequency = doc.frequency ? doc.frequency : undefined
                console.log(currGrind)
                console.log(currFrequency)

                res.render('choices', { user: req.session.username,
                                        active: 'options',
                                        grind: currGrind,
                                        pounds: currPounds,
                                        frequency: currFrequency
                                      });

            });
    }
});

router.post('/choices', function (req, res, next){
    //Are they logged in
    if(!req.session.username){
        res.redirect('/login');
    }
    else{
        var newGrind = req.body.grind;
        var newFrequency = req.body.frequency;
        var newPounds = req.body.pounds;

        var update = {grind: newGrind, frequency: newFrequency, pounds: newPounds};

        Account.findOneAndUpdate(
        {username: req.session.username},
        update, 
        {upsert: true},
        function (err, account){
            if (err){
                res.send('There was an error saving your preferences. Please re-enter your order details. ERROR: '+err)

            }else{
                account.save;
            }
        });
        res.redirect('/delivery');
    }
});

router.get('/delivery', function (req, res, next){
    if(!req.session.username){
        res.redirect('/login');
    }else{
        Account.findOne({username: req.session.username},
            function (err, doc){
                var currAddr1 = doc.addressLine1 ? doc.addressLine1 : ''
                var currAddr2 = doc.addressLine2 ? doc.addressLine2 : ''
                var currFullName = doc.fullName ? doc.fullName : ''
                var currCity = doc.city ? doc.city : ''
                var currState = doc.state ? doc.state : ''
                var currZipCode = doc.zipCode ? doc.zipCode : ''
                var currDeliveryDate = doc.deliveryDate ? doc.deliveryDate : ''
                res.render('delivery', {user: req.session.username,
                                        active: 'delivery',
                                        fullName: currFullName,
                                        addressLine1: currAddr1,
                                        addressLine2: currAddr2,
                                        city: currCity,
                                        state: currState,
                                        zipCode: currZipCode,
                                        deliveryDate: currDeliveryDate
                                        });
            });
        

    }
});

router.post('/delivery', function (req, res, next){
    if(!req.session.username){
        res.redirect('/login');
    }
    else{
        var newFullName = req.body.fullName
        var newAddressLine1 = req.body.addressLine1
        var newAddressLine2 = req.body.addressLine2
        var newCity = req.body.city
        var newState = req.body.state
        var newZipCode = req.body.zipCode
        var newDeliveryDate = req.body.deliveryDate

        var update = {  
                        fullName: newFullName,
                        addressLine1: newAddressLine1,
                        addressLine2: newAddressLine2,
                        city: newCity,
                        state: newState,
                        zipCode: newZipCode,
                        deliveryDate: newDeliveryDate
                     }

        Account.findOneAndUpdate({username: req.session.username},
            update,
            {upsert: true},
            function (err, account){
                if (err){
                    res.send('There was an error saving your preferences. Please re-enter your order details. ERROR: '+err)
                }else{
                    account.save;
                }
        });
        res.redirect('/')

    }
})

module.exports = router;
