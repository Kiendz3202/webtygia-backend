const {
	sjcData,
	// sjcChartData,
	getSjcChart,
	baoTinMinhChauData,
	dojiData,
	pnjData,
	miHongData,
	phuQuyData,
} = require('../../controllers/gold/goldController');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/gold/baotinminhchau`, baoTinMinhChauData);
	app.get(`${pathApi}/gold/doji`, dojiData);
	app.get(`${pathApi}/gold/mihong`, miHongData);
	app.get(`${pathApi}/gold/phuquysjc`, phuQuyData);
	app.get(`${pathApi}/gold/pnj`, pnjData);
	app.get(`${pathApi}/gold/sjc`, sjcData);
	// app.get(`${pathApi}/gold/chart/sjc`, sjcChartData);
	app.get(`${pathApi}/gold/chart/sjc`, getSjcChart);
};
