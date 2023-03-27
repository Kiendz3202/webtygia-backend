const createError = require('http-errors');
const StockChart6M = require('../../models/stock/chartStock/stockChart6MModel');

const Vn30 = require('../../models/stock/stockList/vn30Model');
// const HoseDetail = require('../../models/stock/stockDetail/hoseDetailModel');
// const Vn30Chart = require('../../models/stock/chartStock/vn30ChartModel');

const vn30StockList = async (req, res, next) => {
	try {
		const allStock = await Vn30.find();

		if (!allStock) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { stockList: allStock },
		});
	} catch (error) {
		next(error);
	}
};

//populate thì đầu tiên cần có data description của tất cả công ty lấy từ web investing đã
// const vn30DetailStock = async (req, res, next) => {
// 	try {
// 		const symbol = req.params.symbol;
// 		// console.log(symbol)

// 		const stock = await HoseDetail.find({
// 			symbol: symbol,
// 		})
// 			// .populate(
// 			// 	'companyInfo',
// 			// 	' -createdAt -updatedAt -__v -name -symbol'
// 			// )
// 			.select(' -createdAt -updatedAt -__v');

// 		if (!stock) {
// 			throw createError.NotFound('can not find data');
// 		}

// 		res.status(200).json({ status: 'ok', data: stock });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const vn30DetailChart = async (req, res, next) => {
// 	try {
// 		const symbol = req.params.symbol;
// 		const list = await Vn30Chart.find({ symbol: symbol }).select(
// 			' -createdAt -updatedAt -__v'
// 		);

// 		if (!list) {
// 			throw createError.NotFound('can not find data');
// 		}

// 		res.status(200).json({ status: 'ok', data: list });
// 	} catch (error) {
// 		next(error);
// 	}
// };

const getStockTopRank = async (req, res, next) => {
	const stockList = await Vn30.find(
		{},
		{
			symbol: 1,
			name: 1,
			currentPrice: 1,
			changePercent: 1,
			_id: 0,
		}
	)
		.sort({ turnOver: -1 })
		.limit(7);
	// .select(' -createdAt -updatedAt -__v');

	if (!stockList) {
		throw createError.NotFound('can not find data');
	}

	//aggregrate to response data chart to stocklist
	const arr = [];
	stockList.forEach((stock) => {
		arr.push(stock.symbol);
	});

	const dataChart = await StockChart6M.aggregate([
		{
			$match: {
				$expr: { $in: ['$symbol', arr] },
			},
		},
		{
			// $project: {
			// 	_id: 0,
			// 	t: { $slice: ['$t', -24] },
			// 	price: { $slice: ['$price', -24] },
			// 	nameId: 1,
			// },
			$project: {
				_id: 1,
				t: { $slice: ['$t', -30] },
				price: { $slice: ['$price', -30] },
				symbol: 1,
			},
		},
	]);

	res.status(200).json({
		status: 'ok',
		data: stockList,
		dataChart,
	});
};

module.exports = {
	vn30StockList,
	// vn30DetailStock,
	// vn30DetailChart,
	getStockTopRank,
};
