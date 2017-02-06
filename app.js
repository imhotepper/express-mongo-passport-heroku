var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

var passportSetup =require('./passport-setup');

var routes = require('./routes');
 
var app = express();
app.use(logger());

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/learn-about-me",
        (err, db)=> {
            if (err) return new Error(err);
            console.log('db connected!');
        });
//setup passport from different class        
passportSetup();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"here is the secret!",
    resave: true,
    saveUninitialized :true
}));

app.use(flash());


//passport staff
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('using ', port));