const sw = require('snoowrap');
//uninstall tree-flatten
//uninstall SimulatiryMatrix
const ss = require('string-similarity');

init();
async function init(){
  const swuser = new sw({
    userAgent: 'Windows:scam-bot-finder:1.0.0 (by u/kythosyer)',
    clientId: 'Vs1J05bkHa1lgxNHJkvtsg',
    clientSecret: process.env.CLIENTSECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });
  swuser.getRising().filter(post => post.num_comments > 15).map(post => {
    console.log(post.id);
    swuser.getSubmission(post.id).expandReplies({limit: 25, depth: 2}).then(data => {processData(data)});
  });
}
function processData(data){



  //Current array of used words
  const commonWords = ["i agree", "i agree with", "i agree with you", "i think so", "exactly", "exectly", "of course", "yes", "right", "absolutely right", "you are right", "yeah you are right", "you are right talking", "thank you for thinking", "i appreciate you", "i wish for the same", "i was thinking the same thing", "you're god damn right", "same q", "me too", "me to you", "same", "same too", "same to you", "10/10"];
  //Data per post
  //Extracting comments
  var comments = data.comments;
  //Flatten comments
  //console.log(comments);
  var flatComments = flatten(comments);


  //Refactor to only look at second level comments
  for(i = 0; i < flatComments.length; i++){
    console.log("Comment Number: " + i);
    console.log("Comment Depth: " + flatComments[i].depth);

    //Start the checks for a given comment
    //Confidence rating of being a bot


    if (commonWords.some(v => flatComments[i].body.toLowerCase().includes(v))) {
      //There is at least one of the words in the common bot words list
      console.log("Sus for word usage");
      console.log(flatComments[i].body);
      console.log(flatComments[i].id);
      console.log(flatComments[i].author.name);
      //Probably reply here
    }
    for (k = i + 1; k < flatComments.length; k++) {
        var similarity = ss.compareTwoStrings(flatComments[i].body, flatComments[k].body);
        if(similarity >= 0.5){
          console.log("Sus for similarity: " + similarity);
          console.log(flatComments[i].body);
          console.log(flatComments[i].id);
          console.log(flatComments[i].author.name);
          console.log(flatComments[i].depth);


          console.log(flatComments[k].body);
          console.log(flatComments[k].id);
          console.log(flatComments[k].author.name);
          console.log(flatComments[k].depth);
                //Probably reply here
        }

    }
    }
  }

}

function flatten(arr, result = []){
  arr.forEach((comment) => {
    result.push(comment);
    if(comment.replies.length > 0){
      flatten(comment.replies, result);
    }
  });
  return result;
}
