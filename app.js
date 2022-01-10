//uninstall tree-flatten
//uninstall SimulatiryMatrix

//Custom Modules
const {swuser} = require('./src/swuser.js');
const {commentProcessor} = require('./src/commentprocessor.js');
const {up} = require('./src/userprocessor.js');
const {logger} = require('./src/logger.js');


getPosts();

function getPosts() {
    var datetime = new Date();
    logger.info("Getting new rising posts");

try {
  swuser.getRising({
      limit: 50,
  }).filter(post => post.num_comments > 15).map(post => {
      swuser.getSubmission(post.id).expandReplies({
          limit: 25,
          depth: 2
      }).then(post => {
          logger.info("Data Recieved");
          var commentData = commentProcessor(post);

      });
  });
} catch (e) {
  logger.error(e);
}

}

function processSuspiciousData(commentData){
  console.log(commentData);
}
