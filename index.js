const sw = require('snoowrap');
const ss = require('string-similarity');
const pino = require('pino');
//uninstall tree-flatten
//uninstall SimulatiryMatrix


const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, pino.transport({
  targets: [
  {target: 'pino/file', options: { destination: './logs/all.log'}},
  {target: 'pino-pretty', options: { destination: 1 }} // use 2 for stderr
]}));

const swuser = new sw({
    userAgent: 'Windows:scam-bot-finder:1.0.0 (by u/kythosyer)',
    clientId: 'Vs1J05bkHa1lgxNHJkvtsg',
    clientSecret: process.env.CLIENTSECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
});

getContent();
setInterval(getContent, 120000);


function getContent() {
    var datetime = new Date();
    logger.info("Getting new content");

try {
  swuser.getRising().filter(post => post.num_comments > 50).map(post => {
      swuser.getSubmission(post.id).expandReplies({
          limit: 10,
          depth: 2
      }).then(data => {
          logger.info("Data Recieved");
          processData(data);
      });
  });
} catch (e) {
  logger.error(e);
}

}



function processData(data) {
    //Data per post

    //Extracting comments
    var comments = data.comments;
    //Flatten comments
    var finalComments = flatten(comments);

    logger.debug(data.id);
    logger.debug(data.num_comments);
    logger.debug(finalComments.length);

    for (i = 0; i < finalComments.length; i++) {
        //Start the checks for a given comment
        checkCommonWords(finalComments[i]);
        checkSimilairComments(finalComments, finalComments[i], i);

    }
    logger.info("All comments checked, suspicious comments shown");
}



function checkCommonWords(comment){
  //Current array of top words used by bots
  const sens = 0.65;
  const commonWords = ["i agree", "i agree with", "i agree with you", "i think so", "exectly", "of course", "absolutely right", "you are right", "yeah you are right", "you are right talking", "thank you for thinking", "i appreciate you", "i wish for the same", "i was thinking the same thing", "you're god damn right", "same q", "me too", "me to you", "same", "same too", "same to you", "10/10"];
  for (k = 0; k < commonWords.length; k++) {
      var similarity = ss.compareTwoStrings(comment.body.toLowerCase(), commonWords[k]);
      if (similarity >= sens && comment.depth >= 1) {
          logger.info("=====================================");
          logger.info("\x1b[31m%s\x1b[0m", "WORD USAGE FOUND: " + similarity);
          logger.info("=====================================");
          logger.info("Comment id: " + comment.id);
          logger.info("Comment Author: " + comment.author.name);
          logger.info("Comment Depth: " + comment.depth);
          logger.info("Comment Content: " + comment.body);

          //Probably reply here
          break;
      }
  }
}

function checkSimilairComments(arr, current, i){
          const sens = 0.65;
          for (k = i + 1; k < arr.length; k++) {
            //if(!finalComments[i].body.includes(">")){
              var similarity = ss.compareTwoStrings(current.body, arr[k].body);
              if (similarity >= sens && (current.depth >= 1 || arr[k].depth >= 1)) {
                  logger.info("=====================================");
                  logger.info("\x1b[31m%s\x1b[0m", "SIMILARITY FOUND: " + similarity);
                  logger.info("=====================================");
                  logger.info("Comment id: " + current.id);
                  logger.info("Comment Author: " + current.author.name);
                  logger.info("Comment Depth: " + current.depth);
                  logger.info("Comment Content: " + current.body);
                  logger.info("Comment id: " + arr[k].id);
                  logger.info("Comment Author: " + arr[k].author.name);
                  logger.info("Comment Depth: " + arr[k].depth);
                  logger.info("Comment Content: " + arr[k].body);

                  //Probably reply here
              }
            //}
          }
}

function flatten(arr, result = []) {
    arr.forEach((comment) => {
        result.push(comment);
        if (comment.replies.length > 0) {
            flatten(comment.replies, result);
        }
    });
    return result;
}
