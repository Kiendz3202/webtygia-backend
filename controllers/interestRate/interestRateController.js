const createError = require('http-errors');

const AgribankInterestRate = require('../../models/interestRate/agribankInterestRateModel');
const BidvInterestRate = require('../../models/interestRate/bidvInterestRateModel');
const MbbankInterestRate = require('../../models/interestRate/mbbankInterestRateModel');
const ScbInterestRate = require('../../models/interestRate/scbInterestRateModel');
const VibInterestRate = require('../../models/interestRate/vibInterestRateModel');
const VietcombankInterestRate = require('../../models/interestRate/vietcombankInterestRateModel');
const VietinbankInterestRate = require('../../models/interestRate/vietinbankInterestRateModel');
const ManyBanksInterestRate = require('../../models/interestRate/manyBanksInterestModel');

const agribankInterestRateController = async (req, res, next) => {
	try {
		const data = await AgribankInterestRate.find().select(
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
const bidvInterestRateController = async (req, res, next) => {
	try {
		const data = await BidvInterestRate.find().select(
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

const mbbankInterestRateController = async (req, res, next) => {
	try {
		const data = await MbbankInterestRate.find().select(
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

const scbInterestRateController = async (req, res, next) => {
	try {
		const data = await ScbInterestRate.find().select(
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

const vibInterestRateController = async (req, res, next) => {
	try {
		const data = await VibInterestRate.find().select(
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

const vietcombankInterestRateController = async (req, res, next) => {
	try {
		const data = await VietcombankInterestRate.find().select(
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
const vietinbankInterestRateController = async (req, res, next) => {
	try {
		const data = await VietinbankInterestRate.find().select(
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
const manyBanksInterestRateController = async (req, res, next) => {
	try {
		const data = await ManyBanksInterestRate.find().select(
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
	agribankInterestRateController,
	bidvInterestRateController,
	mbbankInterestRateController,
	scbInterestRateController,
	vibInterestRateController,
	vietcombankInterestRateController,
	vietinbankInterestRateController,
	manyBanksInterestRateController,
};
