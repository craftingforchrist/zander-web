//
// Login
// GET
//
module.exports.login_get = (req, res) => {
  res.render('session/login', {
    setValue: false,
    "pagetitle": "Login"
  });
};

//
// Login
// POST
//
module.exports.login_post = (req, res) => {
  res.send('new login');
};

//
// Sign Up
// GET
//
module.exports.signup_get = (req, res) => {
  res.send('sign up get');
};

//
// Sign Up
// POST
//
module.exports.signup_post = (req, res) => {
  res.send('new sign up');
};
