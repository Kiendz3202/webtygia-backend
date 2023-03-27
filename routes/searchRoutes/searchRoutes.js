const { searchPartial } = require('../../controllers/search/SearchController');

module.exports = function (app, pathApi) {
	app.post(`${pathApi}/search`, searchPartial);
};
