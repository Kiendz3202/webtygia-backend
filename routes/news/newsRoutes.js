const {
	getPaginationPosts,
	getAllPosts,
	getLatestPosts,
	getDetailPost,
	userFollowNews,
	userUnfollowNews,
	getNewsFollowOffline,
	getPAginationPostsByCategory,
} = require('../../controllers/news/newsController');
const { verifyToken } = require('../../middlewares/auth/verifyToken');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/get-list-news`, getPaginationPosts);
	app.get(`${pathApi}/get-all-news`, getAllPosts);
	app.get(`${pathApi}/get-latest-news`, getLatestPosts);
	app.get(`${pathApi}/get-detail-news/:id`, getDetailPost);
	app.post(`${pathApi}/follow-news`, verifyToken, userFollowNews);
	app.post(`${pathApi}/unfollow-news`, verifyToken, userUnfollowNews);
	app.post(`${pathApi}/news/news-follow-offline`, getNewsFollowOffline);
	app.get(`${pathApi}/get-list-news/category`, getPAginationPostsByCategory);
};
