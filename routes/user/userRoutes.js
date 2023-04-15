const {
	getUserPopulate,
	getUserPopulatePagination,
	getUser,
	getUserPopulateSymbolStock,
	updateViewAndScore,
	userFollow,
	userUnfollow,
	getUserFollowAndInterest,
	getRank2WithoutChartDefaultData,
	getUserWithAllPopulate,
	getPreviewDataFollowOffline,
} = require('../../controllers/user/userController');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/user-populate/:email`, getUserPopulate);
	app.get(
		`${pathApi}/user-populate-pagination/:email`,
		getUserPopulatePagination
	);
	app.get(`${pathApi}/user/:email`, getUser);
	app.get(
		`${pathApi}/user-populate-symbol-stock/:email`,
		getUserPopulateSymbolStock
	);
	app.post(`${pathApi}/update-score-coins`, updateViewAndScore);
	app.post(`${pathApi}/follow`, userFollow);
	app.post(`${pathApi}/unfollow`, userUnfollow);
	app.post(`${pathApi}/user-follow-and-interest`, getUserFollowAndInterest);
	app.get(
		`${pathApi}/list-rank2-without-chart`,
		getRank2WithoutChartDefaultData
	);
	app.get(`${pathApi}/user-populate-all/:email`, getUserWithAllPopulate);
	app.post(
		`${pathApi}/user/preview-data-follow-offline`,
		getPreviewDataFollowOffline
	);
};
