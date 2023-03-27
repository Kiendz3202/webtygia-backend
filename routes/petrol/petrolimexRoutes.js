const {
	petrolPrice,
	getPetrolimexChart,
} = require('../../controllers/petrol/petrolimexController');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/petrol/petrolimex`, petrolPrice);
	app.get(`${pathApi}/petrol/chart/petrolimex`, getPetrolimexChart);
};
