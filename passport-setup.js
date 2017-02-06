var passport = require('passport');
var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(){

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user){
            done(err,user);
        });
    });
};

passport.use('login', new LocalStrategy(
    function(username, password, done){
        User.findOne({username: username}, function(err, user){
              if (err) return done(err);
              if (!user) return done(null, false, {message:'No user found with specified user name!'});

              user.checkPassword(password, function(err, isMatch){
                  if (err) return done(err);
                  if (isMatch) {return done(null, user);}
                  else {
                      return done(null, false, {message:'Wrong password'});
                    }
              });  
        });
    }));

