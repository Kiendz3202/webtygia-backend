const createError = require('http-errors');
const UsdInManyBanks = require('../../models/foreignCurrency/usdInManyBanksModel');
const UsdVietcombankChart = require('../../models/foreignCurrency/usdVietcombankChart');

const getUsdInManyBanks = async (req, res, next) => {
	try {
		const data = await UsdInManyBanks.find().select(
			'-_id -createdAt -updatedAt -__v'
		);

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

const getUsdVietcombankChart = async (req, res, next) => {
	try {
		const days = req.query.days || '1d';

		if (days !== '1d' && days !== '1y' && days !== 'max') {
			throw createError.BadRequest('query days must be 1d, 1y, max');
		}

		const data = await UsdVietcombankChart.find({ name: days }).select(
			'-_id -createdAt -updatedAt -__v'
		);

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsdInManyBanks, getUsdVietcombankChart };
