const UserModel = require(__path_models + 'users');
const notify = require(__path_configs + 'notify');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');

module.exports = function(passport){
        
    passport.use(new LocalStrategy(
        function(username, password, done) {
            UserModel.getItembyUsername(username).then((user) => {
                if (!user) {
                    return done(null, false,{message: notify.ERROR_LOGIN});
                }else{
                    if(md5(password) !== user.password){
                        return done(null, false, {message: notify.ERROR_LOGIN});
                    }else{
                        return done(null, user);
                    }
                }
            })
                
        }

    ));

    passport.serializeUser(function(user, done){
        done(null, user._id);
    })

    passport.deserializeUser(function(id, done){
        UserModel.getItem(id, null).then((user) => {
            done(null, user)
        })
    })
}