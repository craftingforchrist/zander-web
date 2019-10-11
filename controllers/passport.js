const LocalStrategy = require('passport-local').Strategy;

const authenticateUser = (done) => {
  const username = process.env.adminpanelusername;
  const password = process.env.adminpanelpassword;

  if (username == null) {
    return done(null, false, { message: "That user does not exist" });
  };


}
passportjs.use(new LocalStrategy({ username: 'username'}), authenticateUser)
passportjs.serializeUser((user, done) => { })
passportjs.deserializeUser((id, done) => { })
