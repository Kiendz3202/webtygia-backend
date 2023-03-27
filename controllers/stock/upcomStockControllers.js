const createError = require('http-errors');

const Upcom = require('../../models/stock/stockList/upcomModel');
// const UpcomDetail = require('../../models/stock/stockDetail/upcomDetailModel');
// const UpcomChart = require('../../models/stock/chartStock/upcomChartModel');

const upcomStockList = async (req, res, next) => {
	try {
		const perPage = req.query.per_page || 25;
		const page = req.query.page || 1;
		if (
			!(
				Number.isInteger(parseFloat(perPage)) && parseFloat(perPage) > 0
			) ||
			!(Number.isInteger(parseFloat(page)) && parseFloat(page) > 0)
		) {
			throw createError.BadRequest(
				'query per_page and page must be integer and larger than 0'
			);
		}
		const allStock = await Upcom.find();
		const allStockLength = allStock.length;
		const countPage = Math.ceil(allStockLength / perPage);

		//-------------pagination by mongoose------------------------
		const stockList = await Upcom.find({})
			.sort({ symbol: 1 })
			.skip(perPage * page - perPage)
			.limit(perPage)
			.select(' -createdAt -updatedAt -__v');

		if (!stockList) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { stockList, pages: countPage },
		});
	} catch (error) {
		next(error);
	}
};

//populate thì đầu tiên cần có data description của tất cả công ty lấy từ web investing đã
// const upcomDetailStock = async (req, res, next) => {
// 	try {
// 		const symbol = req.params.symbol;
// 		// console.log(symbol)

// 		const stock = await UpcomDetail.find({
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

// const upcomDetailChart = async (req, res, next) => {
// 	try {
// 		const symbol = req.params.symbol;
// 		const list = await UpcomChart.find({ symbol: symbol }).select(
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

module.exports = {
	upcomStockList,
	// upcomDetailStock,
	// upcomDetailChart,
};
