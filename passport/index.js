const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
let presentUser = {};

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        if (presentUser?.id === id) {
            return done(null, presentUser);
        }
        User.findOne({ 
            where: {id},
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        })
         .then(user => {
             presentUser = user;
             done(null, user)
         })
         .catch(err => done(err));
    });

    local();
    kakao();
};