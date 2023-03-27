const createError = require('http-errors');

const AgribankExchange = require('../../models/exchangeRate/agribankExchangeModel');
const BidvExchange = require('../../models/exchangeRate/bidvExchangeModel');
const MbbankExchange = require('../../models/exchangeRate/mbbankExchangeModel');
const TechcombankExchange = require('../../models/exchangeRate/techcombankExchangeModel');
const VietcombankExchange = require('../../models/exchangeRate/vietcombankExchangeModel');
const VietinBankExchange = require('../../models/exchangeRate/vietinbankExchangeModel');

const ExchangeUsdToVnd = require('../../models/exchangeRate/exchangeUsdToVndModel');

const agribankController = async (req, res, next) => {
	try {
		const data = await AgribankExchange.find().select(
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

const bidvController = async (req, res, next) => {
	try {
		const data = await BidvExchange.find().select(
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

const mbbankController = async (req, res, next) => {
	try {
		const data = await MbbankExchange.find().select(
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

const techcombankController = async (req, res, next) => {
	try {
		const data = await TechcombankExchange.find().select(
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

const vietcombankController = async (req, res, next) => {
	try {
		const data = await VietcombankExchange.find().select(
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

const vietinbankController = async (req, res, next) => {
	try {
		const data = await VietinBankExchange.find().select(
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

const getExchangeUsdToVnd = async (req, res, next) => {
	try {
		const data = await ExchangeUsdToVnd.find().select(
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
	agribankController,
	bidvController,
	mbbankController,
	techcombankController,
	vietcombankController,
	vietinbankController,
	getExchangeUsdToVnd,
};
