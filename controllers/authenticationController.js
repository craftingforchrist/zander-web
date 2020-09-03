const database = require('./database'); // zander Database controller


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
  try {
    const sql = ``;

    database.query (sql, [], function (error, results, fields) {
      if (error) {
        throw error;
      } else {
        // console.log(`${streamData.user_name} has gone LIVE with ${streamData.viewer_count} viewers! Broadcasting to website.`);

        console.log('This worked successfully.');
      }
    });


  } catch (err) {

  }

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
