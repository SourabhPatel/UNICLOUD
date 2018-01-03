const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt =require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config =require('../config/database');

module.exports =function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.getUserById({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account
            }
        });
    }));
}