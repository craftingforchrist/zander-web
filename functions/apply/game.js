// // game.js
// const database = require('../../controllers/database');
// const uuid = require('../uuid');
//
// //
// // Duplication Check
// //
// function applycheck(username, res) {
//   database.query (`SELECT COUNT(*) as 'user' from gameapplications WHERE username=?;`, [username], function (error, results, fields) {
//     console.log(results[0]);
//
//     if (results[0].user > 1) {
//       res.render('apply/apply', {
//         "pagetitle": "Apply",
//         erroralert: true,
//         message: "This Username has already applied for access. Not you? Email our support team: <a href='mailto:<%= contactemail %>'>"
//       });
//       console.log('Duplication Detected');
//     };
//   });
// };
//
// //
// // Game Application Database Insert
// //
// function applygamedbinsert(username, email, discordtag, howdidyouhearaboutus, otherinformation) {
//   var playeruuid = uuid.get(username);
//   database.query (`INSERT INTO gameapplications (uuid, username, email, discordtag, howdidyouhearaboutus, otherinformation, appstatus) VALUES (?, ?, ?, ?, ?, ?, ?)`, [playeruuid, username, email, discordtag, howdidyouhearaboutus, otherinformation, "PROCESSING"], function (error, results, fields) {
//     if (error) {
//       throw error
//     };
//     console.log(uuid.get(username));
//   });
// };
//
// module.exports = {
//   applygamedbinsert,
//   applycheck
// };
