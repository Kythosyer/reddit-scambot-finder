const sw = require("snoowrap");
const swuser = new sw({
	userAgent: "Windows:scam-bot-finder:3.0.0 (by u/kythosyer)",
	clientId: "Vs1J05bkHa1lgxNHJkvtsg",
	clientSecret: process.env.CLIENTSECRET,
	username: process.env.USERNAME,
	password: process.env.PASSWORD
});
module.exports = {swuser};
