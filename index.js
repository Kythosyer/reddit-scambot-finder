const sw = require('snoowrap');
init();
async function init(){
  const swuser = new sw({
    userAgent: 'Windows:scam-bot-finder:1.0.0 (by u/kythosyer)',
    clientId: 'Vs1J05bkHa1lgxNHJkvtsg',
    clientSecret: process.env.CLIENTSECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });

  var risingContent = await swuser.getRising();
  console.log(risingContent.length);

}
