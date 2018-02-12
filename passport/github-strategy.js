const passport = require("passport");
const GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
    clientID: "d45e67d8606346636e3d",
    clientSecret: "6c70b006b9d73196c5d4b63c51a2e01bd035f5de",
    callbackURL: "http://localhost:30000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));