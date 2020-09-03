const database = require('./database'); // zander Database controller

//
// Login
// GET
//
module.exports.login_get = (req, res) => {
  res.render('session/login', {
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
// Register
// GET
//
module.exports.signup_get = (req, res) => {
  res.render('session/register', {
    "pagetitle": "Register"
  });
};

//
// Register
// POST
//
module.exports.signup_post = (req, res) => {
  try {
    const { minecraftign, email, password, passwordconfirm } = req.body;

    if (password === passwordconfirm) {
      console.log('These match');
    } else {
      res.render('session/register', {
        "pagetitle": "Register",
        "error": true,
        "errormsg": "This is the error message."
      });
    };


    // const sql = ``;
    //
    // database.query (sql, [], function (error, results, fields) {
    //   if (error) {
    //     throw error;
    //   } else {
    //     // console.log(`${streamData.user_name} has gone LIVE with ${streamData.viewer_count} viewers! Broadcasting to website.`);
    //
    //     console.log('This worked successfully.');
    //   }
    // });

    console.log(req.body);
  } catch (err) {

  }
};
