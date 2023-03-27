const createError = require('http-errors');
const BaoTinMinhChau = require('../../models/gold/baoTinMinhchauModel');
const Doji = require('../../models/gold/dojiModel');
const MiHong = require('../../models/gold/miHongModel');
const PhuQuySjc = require('../../models/gold/phuquysjcModel');
const Pnj = require('../../models/gold/pnjModel');
const Sjc = require('../../models/gold/sjcModel');
const SjcChart = require('../../models/gold/sjcChartModel');

const baoTinMinhChauData = async (req, res, next) => {
	try {
		const data = await BaoTinMinhChau.find().select(
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

const dojiData = async (req, res, next) => {
	try {
		const data = await Doji.find().select(' -createdAt -updatedAt -__v');

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

const miHongData = async (req, res, next) => {
	try {
		const data = await MiHong.find().select(' -createdAt -updatedAt -__v');

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

const phuQuyData = async (req, res, next) => {
	try {
		const data = await PhuQuySjc.find().select(
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

const pnjData = async (req, res, next) => {
	try {
		const data = await Pnj.find().select(' -createdAt -updatedAt -__v');

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

const sjcData = async (req, res, next) => {
	try {
		const data = await Sjc.find().select(' -createdAt -updatedAt -__v');

		if (!data) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: data });
	} catch (error) {
		next(error);
	}
};

// const sjcChartData = async (req, res, next) => {
// 	try {
// 		const data = await SjcChart.find().select(
// 			' -createdAt -updatedAt -__v'
// 		);

// 		if (!data) {
// 			throw createError.NotFound('can not find data');
// 		}

// 		res.status(200).json({ status: 'ok', data: data });
// 	} catch (error) {
// 		next(error);
// 	}
// };

const getSjcChart = async (req, res, next) => {
	try {
		const days = req.query.days || '1d';

		if (days !== '1d' && days !== '1y' && days !== 'max') {
			throw createError.BadRequest('query days must be 1d, 1y, max');
		}

		const data = await SjcChart.find({ type: days }).select(
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

module.exports = {
	sjcData,
	// sjcChartData,
	getSjcChart,
	baoTinMinhChauData,
	dojiData,
	pnjData,
	miHongData,
	phuQuyData,
};
