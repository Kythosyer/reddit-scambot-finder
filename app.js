//Custom Modules
const {swuser} = require("./src/swuser.js");
const {commentProcessor} = require("./src/commentprocessor.js");
const {userProcessor} = require("./src/userprocessor.js");
const {logger} = require("./src/logger.js");

getPosts();
setInterval(getPosts, 300000);

function getPosts() {
	var datetime = new Date();
	logger.info("Getting popular subreddit's rising posts");

	try {
		swuser.getPopularSubreddits({limit: 10}).map(subreddit => {
			swuser.getRising(subreddit.display_name, {limit: 25}).filter(submission => submission.num_comments > 10).map(submission => {
				swuser.getSubmission(submission.id).expandReplies({limit: 25, depth: 1}).then(submission => {
					var commentData = commentProcessor(submission);
					processSuspiciousData(commentData);
				});
			});
		});
	} catch (e) {
		logger.error(e);
	}
	// swuser.getRising({limit: 100}).filter(post => post.num_comments > 10).map(post => {
	//   swuser.getSubmission(post.id).expandReplies({limit: 25, depth: 2}).then(post => {
	//     logger.info("Data Recieved");
	//     var commentData = commentProcessor(post);
	//     processSuspiciousData(commentData);
	//   });
	// });
}

function processSuspiciousData(commentData) {
	logger.debug(commentData);
	if (commentData.cFound) {
		var commonComments = commentData.cArr;
		var numComments = commentData.cArr.length;
	}
	if (commentData.sFound) {
		var similarComments = commentData.sArr;
		var numComment = commentData.sArr.length;
	}
	//Account investigation
	//var confirmedComments = userProcessor(commentData);

	//replyProcessor(confirmedComments);

}
