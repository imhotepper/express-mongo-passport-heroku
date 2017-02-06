var router = require('express').Router();
var passport = require('passport');

var User = require('./models/user');

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

//get all users
router.get('/', (req, res) => {
    User.find()
        .sort({ createdAd: 'descending' })
        .exec((err, users) => {
            if (err) return next(err);
            res.render('index', { users: users });
        });
});

router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({ username: username }, (err, user) => {
        if (err) return next(err);
        if (user) {
            req.flash("error", "User already exists!");
            return res.redirect('/signup');
        }

        var newUser = new User({
            username: username,
            password: password
        });
 
        newUser.save(next);

    });
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.get('/users/:username', (req, res, next)=>{
    User.findOne({username: req.params.username}, (err, user)=>{
        if (err) return next(err);
        if (!user) return next(404); //this is interesting!!!
        res.render('profile', {user: user});
    });

});

router.get('/login', (req, res) => res.render('login'));
router.post('/login', passport.authenticate('login',{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get('/logout', (req, res)=>{
    req.logout(); 
    res.redirect('/');
});

function ensureAutheticated(req, res, next){
    if (req.isAuthenticated()) next();
    else{
        req.flash("info", "You must be logged in to see this page!");
        res.redirect('/login');
    }
}

router.get('/edit', ensureAutheticated, (req, res)=>{
    res.render('edit');
});
router.post('/edit', ensureAutheticated, (req, res, next)=>{
    req.user.displayName = req.body.displayname;
    req.user.bio = req.body.bio;
    req.user.save((err, user)=>{
        if (err){
            next(err);
            return;
        }
        req.flash('info', "Profile updated!");
        res.redirect('/edit');
    });
});



module.exports = router;