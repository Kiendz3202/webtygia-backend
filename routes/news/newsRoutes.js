const {
	getPaginationPosts,
	getAllPosts,
	getLatestPosts,
	getDetailPost,
	userFollowNews,
	userUnfollowNews,
	getNewsFollowOffline,
} = require('../../controllers/news/newsController');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/get-list-news`, getPaginationPosts);
	app.get(`${pathApi}/get-all-news`, getAllPosts);
	app.get(`${pathApi}/get-latest-news`, getLatestPosts);
	app.get(`${pathApi}/get-detail-news/:id`, getDetailPost);
	app.post(`${pathApi}/follow-news`, userFollowNews);
	app.post(`${pathApi}/unfollow-news`, userUnfollowNews);
	app.post(`${pathApi}/news/news-follow-offline`, getNewsFollowOffline);
};
