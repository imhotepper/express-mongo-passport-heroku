var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes');
 
var app = express();

mongoose.connect("mongodb://localhost/learn-about-me",
        (err, db)=> {
            if (err) return new Error(err);
            console.log('db connected!');
        });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  

app.use(bodyParser(bodyParser.urlencoded({extended:false})));
app.use(cookieParser());
app.use(session({
    secret:"here is the secret!",
    resave: true,
    saveUninitialized :true
}));

app.use(flash());
app.use(routes);


app.listen(3000, ()=> console.log('using 3000'));