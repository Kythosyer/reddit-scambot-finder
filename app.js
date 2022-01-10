//Custom Modules
const {swuser} = require("./src/swuser.js");
const {commentProcessor} = require("./src/commentprocessor.js");
const {up} = require("./src/userprocessor.js");
const {logger} = require("./src/logger.js");

getPosts();
setInterval(getPosts, 300000);

function getPosts() {
  var datetime = new Date();
  logger.info("Getting new rising posts");

  try {
    swuser
      .getRising({
        limit: 50
      })
      .filter(post => post.num_comments > 15)
      .map(post => {
        swuser
          .getSubmission(post.id)
          .expandReplies({
            limit: 25,
            depth: 2
          })
          .then(post => {
            logger.info("Data Recieved");
            var commentData = commentProcessor(post);
            processSuspiciousData(commentData);
          });
      });
  } catch (e) {
    logger.error(e);
  }
}

function processSuspiciousData(commentData) {
  logger.debug(commentData);
  if (commentData.cFound) {
    var commonComments = commentData.cArr;
    var numComments = commentData.cArr.length;
  }
  if (commentData.sFound) {
    var similarComments = commentData.sArr;
    var numComment = commentData.cArr.length;
  }
}
