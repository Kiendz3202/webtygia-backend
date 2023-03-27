const {
	hnx30StockList,

	// hnx30DetailStock,
	// hnx30DetailChart,
} = require('../../controllers/stock/hnx30StockControllers');
const {
	hnxStockList,
	// hnxDetailStock,
	// hnxDetailChart,
} = require('../../controllers/stock/hnxStockControllers');
const {
	hoseStockList,
	// hoseDetailStock,
	// hoseDetailChart,
} = require('../../controllers/stock/hoseStockControllers');
const {
	vn30StockList,
	// vn30DetailStock,
	// vn30DetailChart,
	getStockTopRank,
} = require('../../controllers/stock/vn30StockControllers');
const {
	upcomStockList,
	// upcomDetailStock,
	// upcomDetailChart,
} = require('../../controllers/stock/upcomStockControllers');

const {
	getStockDescription,
} = require('../../controllers/stock/stockDescriptionController');
const {
	getStockChart,
} = require('../../controllers/stock/stockChartController');

const {
	detailStock,
	getUserStockReference,
	getStockReference,
	getStockFollowOffline,
} = require('../../controllers/stock/stockDetailController');

module.exports = function (app, pathApi) {
	//===HNX30===
	app.get(`${pathApi}/stock/hnx30`, hnx30StockList);

	// app.get(`${pathApi}/stock/hnx30/:symbol`, hnx30DetailStock);

	// app.get(`${pathApi}/stock/hnx30/chart/:symbol`, hnx30DetailChart);s
	//===========

	//===HNX===
	app.get(`${pathApi}/stock/hnx`, hnxStockList);

	// app.get(`${pathApi}/stock/hnx/:symbol`, hnxDetailStock);

	// app.get(`${pathApi}/stock/hnx/chart/:symbol`, hnxDetailChart);
	//==========

	//===HOSE===
	app.get(`${pathApi}/stock/hose`, hoseStockList);

	// app.get(`${pathApi}/stock/hose/:symbol`, hoseDetailStock);

	// app.get(`${pathApi}/stock/hose/chart/:symbol`, hoseDetailChart);
	//===========

	//===VN30===
	app.get(`${pathApi}/stock/vn30`, vn30StockList);

	// app.get(`${pathApi}/stock/vn30/:symbol`, vn30DetailStock);

	// app.get(`${pathApi}/stock/vn30/chart/:symbol`, vn30DetailChart);

	app.get(`${pathApi}/stock/top-rank`, getStockTopRank);
	//==========

	//===UPCOM===
	app.get(`${pathApi}/stock/upcom`, upcomStockList);

	// app.get(`${pathApi}/stock/upcom/:symbol`, upcomDetailStock);

	// app.get(`${pathApi}/stock/upcom/chart/:symbol`, upcomDetailChart);
	//===========

	//=====Detail========
	app.get(`${pathApi}/stock/:symbol`, detailStock);
	app.post(`${pathApi}/stock/user-stock-reference`, getUserStockReference);
	app.get(`${pathApi}/stock/stock-reference/preview`, getStockReference);
	//============

	//===Description Company===
	app.get(`${pathApi}/stock/description/:symbol`, getStockDescription);
	//==========================

	//===Chart===
	app.get(`${pathApi}/stock/chart/:symbol`, getStockChart);
	//===========

	//===getStockFollowOffline===
	app.post(`${pathApi}/stock/stock-follow-offline`, getStockFollowOffline);
	//===========
};
