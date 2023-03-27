const createError = require('http-errors');
const StockChart1W = require('../../models/stock/chartStock/stockChart1WModel');
const StockChart6M = require('../../models/stock/chartStock/stockChart6MModel');
const StockDetail = require('../../models/stock/stockDetail/stockDetailModel');
const UserInterest = require('../../models/user/userInterestModel');
const User = require('../../models/user/userModel');

const detailStock = async (req, res, next) => {
	try {
		const symbol = req.params.symbol;
		// console.log(symbol)

		const stock = await StockDetail.find({
			symbol: symbol,
		})
			// .populate(
			// 	'companyInfo',
			// 	'-_id -createdAt -updatedAt -__v -name -symbol'
			// )
			.select(' -createdAt -updatedAt -__v');

		if (!stock) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: stock });
	} catch (error) {
		next(error);
	}
};

const getUserStockReference = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.find({ email });

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		const data = await UserInterest.find({
			email,
			detailModel: 'StockDetail',
		}).populate('detail');
		res.status(200).json({
			status: 'ok',
			data: data,
		});
	} catch (error) {
		next(error);
	}
};
const getStockReference = async (req, res, next) => {
	try {
		const skipRandom = Math.floor(Math.random() * 100);
		const stockList = await StockDetail.find({})
			.sort({ symbol: 1 })
			.collation({
				locale: 'en_US',
				numericOrdering: true,
			})
			// .skip(skipRandom)
			.limit(4);

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
				$project: {
					_id: 0,
					t: { $slice: ['$t', -24] },
					price: { $slice: ['$price', -24] },
					symbol: 1,
				},
				// $project: {
				// 	_id: 1,
				// 	data: { $slice: ['$data', -24] },
				// 	nameId: 1,
				// },
			},
		]);

		res.status(200).json({
			status: 'ok',
			data: { stockList, dataChart },
		});
	} catch (error) {
		next(error);
	}
};

const getStockFollowOffline = async (req, res, next) => {
	try {
		const { arrIdStock } = req.body;

		const stockList = await StockDetail.find({
			symbol: {
				$in: arrIdStock,
			},
		})
			// .sort({ symbol: 1 })
			// .collation({
			// 	locale: 'en_US',
			// 	numericOrdering: true,
			// })
			// .skip(perPage * page - perPage)
			// .limit(perPage)
			.select(' -createdAt -updatedAt -__v');

		if (!stockList) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { stockList },
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	detailStock,
	getUserStockReference,
	getStockReference,
	getStockFollowOffline,
};
