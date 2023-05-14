const admin = require("firebase-admin");

const fig = require("../../firebaseconfig.json");

admin.initializeApp({
  credential: admin.credential.cert(fig),
});

module.exports.admin = admin;
