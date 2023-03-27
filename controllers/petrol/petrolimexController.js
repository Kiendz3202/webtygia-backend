const createError = require('http-errors');

const Petrolimex = require('../../models/petrol/petrolimexModel');
const PetrolimexChart = require('../../models/petrol/petrolimexChartModel');

const petrolPrice = async (req, res, next) => {
	try {
		const data = await Petrolimex.find().select(
			' -createdAt -updatedAt -__v'
		);

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

const getPetrolTopRank = async (req, res, next) => {
	const coinList = await Petrolimex.find(
		{},
		{
			nameId: 1,
			symbol: 1,
			name: 1,
			currentPrice: 1,
			priceChange1hPercent: 1,
			image: 1,
			_id: 0,
		}
	)
		.sort({ rank: 1 })
		.limit(7);
	// .select(' -createdAt -updatedAt -__v');

	if (!coinList) {
		throw createError.NotFound('can not find data');
	}

	res.status(200).json({
		status: 'ok',
		data: coinList,
	});
};

const getPetrolimexChart = async (req, res, next) => {
	try {
		const days = req.query.days || '1d';

		if (days !== '1d' && days !== '1y' && days !== 'max') {
			throw createError.BadRequest('query days must be 1d, 1y, max');
		}

		const data = await PetrolimexChart.find({ type: days }).select(
			' -createdAt -updatedAt -__v'
		);

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

module.exports = { petrolPrice, getPetrolimexChart };
