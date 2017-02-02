var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAd: { type: Date, default: Date.new },
    displayName: String,
    bio: String
});

userSchema.methods.name = () => this.displayName || this.username;

function noop() { };

userSchema.pre('save', (done) => {
    var user = this;
    if (!user.isModified('password')) return done();
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return done(err);
        bcrypt.hash(user.password, salt, noop,
            (err, hashedPassword) => {
                if (err) return done(err);
                user.password = hashedPassword;
                done();
            });
    });
});

var User = mongoose.model('User', userSchema);

module.exports = User;