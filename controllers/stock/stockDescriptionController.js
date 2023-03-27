const createError = require('http-errors');
const StockDescription = require('../../models/stock/stockDescription/stockDescriptionModel');

const getStockDescription = async (req, res, next) => {
	try {
		const symbol = req.params.symbol;
		// console.log(symbol)

		const stock = await StockDescription.find({
			symbol: symbol,
		})
			// .populate(
			// 	'companyInfo',
			// 	' -createdAt -updatedAt -__v -name -symbol'
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

module.exports = { getStockDescription };
