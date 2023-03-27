const createError = require('http-errors');
const StockChart1W = require('../../models/stock/chartStock/stockChart1WModel');
const StockChart6M = require('../../models/stock/chartStock/stockChart6MModel');
const StockChartMax = require('../../models/stock/chartStock/stockChartMaxModel');

const getStockChart = async (req, res, next) => {
	try {
		const stockSymbol = req.params.symbol || 'AAV';
		const days = req.query.days || '1W';

		if (days !== '1W' && days !== '6M' && days !== 'max') {
			throw createError.BadRequest('query days must be 1W, 6M, max');
		}
		let chartData;
		if (days === '1W') {
			chartData = await StockChart1W.find({ symbol: stockSymbol }).select(
				' -__v -createdAt -updatedAt'
			);

			if (!chartData) {
				throw createError.NotFound('can not find data');
			}
		}

		if (days === '6M') {
			chartData = await StockChart6M.find({ symbol: stockSymbol }).select(
				' -__v -createdAt -updatedAt'
			);

			if (!chartData) {
				throw createError.NotFound('can not find data');
			}
		}

		if (days === 'max') {
			chartData = await StockChartMax.find({
				symbol: stockSymbol,
			}).select(' -__v -createdAt -updatedAt');

			if (!chartData) {
				throw createError.NotFound('can not find data');
			}
		}

		res.status(200).json({ status: 'ok', data: chartData });
	} catch (error) {
		next(error);
	}
};

module.exports = { getStockChart };
