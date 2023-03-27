const createError = require('http-errors');

const Hnx30 = require('../../models/stock/stockList/hnx30Model');
// const HnxDetail = require('../../models/stock/stockDetail/hnxDetailModel');
// const Hnx30Chart = require('../../models/stock/chartStock/hnx30ChartModel');

const hnx30StockList = async (req, res, next) => {
	try {
		const allStock = await Hnx30.find();

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
// const hnx30DetailStock = async (req, res, next) => {
// 	try {
// 		const symbol = req.params.symbol;
// 		// console.log(symbol)

// 		const stock = await HnxDetail.find({
// 			symbol: symbol,
// 		})
// 			// .populate(
// 			// 	'companyInfo',
// 			// 	'-_id -createdAt -updatedAt -__v -name -symbol'
// 			// )
// 			.select('-_id -createdAt -updatedAt -__v');

// 		if (!stock) {
// 			throw createError.NotFound('can not find data');
// 		}

// 		res.status(200).json({ status: 'ok', data: stock });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const hnx30DetailChart = async (req, res, next) => {
// 	try {
// 		const symbol = req.params.symbol;
// 		const list = await Hnx30Chart.find({ symbol: symbol }).select(
// 			'-_id -createdAt -updatedAt -__v'
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
	hnx30StockList,
	// hnx30DetailStock,
	// hnx30DetailChart,
};
