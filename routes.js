var router = require('express').Router();
var User = require('./models/user');

router.use((req, res,next)=>{
    res.locals.currentUser =  req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos =  req.flash('info');
    next();
});

//get all users
router.get('/', (req, res)=>{
    User.find()
    .sort({createdAd: 'descending'})
    .exec((err, users)=>{
        if (err) return next(err);
        res.render('index', {users: users});
    });
});


module.exports =  router;