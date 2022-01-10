const ss = require("string-similarity");

//Custom Modules
const {logger} = require("./logger.js");

function commentProcessor(post) {
	//Data per post

	//Extracting comments
	var comments = post.comments;
	//Flatten comments
	var finalComments = flatten(comments);

	logger.debug(post.id);
	logger.debug(post.num_comments);
	logger.debug(finalComments.length);
	//Start the checks for a given comment
	var commonComments = checkCommonWords(finalComments);
	var similarComments = checkSimilairComments(finalComments);

	//logger.info("All comments checked, suspicious comments shown");
	var rArr = {
		cArr: commonComments,
		sArr: similarComments,
		cFound: commonComments.length > 0,
		sFound: similarComments.length > 0
	};
	return rArr;
}

function checkCommonWords(comments) {
	//Current array of top words used by bots
	var commonComments = new Array();
	const sens = 0.65;
	const commonWords = [
		"i agree",
		"i agree with",
		"i agree with you",
		"i think so",
		"exactly",
		"exectly",
		"of course",
		"absolutely right",
		"you are right",
		"yeah you are right",
		"you are right talking",
		"thank you for thinking",
		"i appreciate you",
		"i wish for the same",
		"i was thinking the same thing",
		"you're god damn right",
		"same q",
		"me too",
		"me to you",
		"same",
		"same too",
		"same to you",
		"10/10"
	];
	for (i = 0; i < comments.length; i++) {
		for (k = 0; k < commonWords.length; k++) {
			var similarity = ss.compareTwoStrings(comments[i].body.toLowerCase(), commonWords[k]);
			if (similarity >= sens && comments[i].depth >= 1) {
				logger.info("=====================================");
				logger.info("\x1b[31m%s\x1b[0m", "WORD USAGE FOUND: " + similarity);
				logger.info("=====================================");
				logger.info("Comment id: " + comments[i].id);
				logger.info("Comment Author: " + comments[i].author.name);
				logger.info("Comment Depth: " + comments[i].depth);
				logger.info("Comment Content: " + comments[i].body);
				comments[i].confidence = similarity;
				commonComments.push(comments[i]);
			}
		}
	}

	return commonComments;
}

function checkSimilairComments(comments) {
	var similarComments = new Array();
	const sens = 0.675;
	for (i = 0; i < comments.length; i++) {
		for (k = i + 1; k < comments.length; k++) {

				var similarity = ss.compareTwoStrings(comments[i].body, comments[k].body);
				if (similarity >= sens && (comments[i].depth >= 1 || comments[k].depth >= 1)) {
          if (!comments[i].body.includes(">") && !comments[k].body.includes(">")) {
              logger.info("=====================================");
    					logger.info("\x1b[31m%s\x1b[0m", "SIMILARITY FOUND: " + similarity);
    					logger.info("=====================================");
    					logger.info("Comment id: " + comments[i].id);
    					logger.info("Comment Author: " + comments[i].author.name);
    					logger.info("Comment Depth: " + comments[i].depth);
    					logger.info("Comment Content: " + comments[i].body);
    					logger.info("Comment id: " + comments[k].id);
    					logger.info("Comment Author: " + comments[k].author.name);
    					logger.info("Comment Depth: " + comments[k].depth);
    					logger.info("Comment Content: " + comments[k].body);
    					comments[i].confidence = similarity;
    					similarComments.push(comments[i]);
    					comments[k].confidence = similarity;
    					similarComments.push(comments[k]);


          }
				}

		}
	}
	return similarComments;
}

function flatten(arr, result = []) {
	arr.forEach(comment => {
		result.push(comment);
		if (comment.replies.length > 0) {
			flatten(comment.replies, result);
		}
	});
	return result;
}
module.exports = {
	commentProcessor
};
