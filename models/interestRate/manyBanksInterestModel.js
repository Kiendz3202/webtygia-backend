const mongoose = require('mongoose');

const manyBanksInterestRateSchema = mongoose.Schema(
	{
		name: { type: 'String' },
		timeUpdate: { type: 'String' },
		offline: { type: Array, default: [] },
		online: { type: Array, default: [] },
	},
	{
		timestamps: true,
	}
);

const ManyBanksInterestRate = mongoose.model(
	'ManyBanksInterestRate',
	manyBanksInterestRateSchema
);
module.exports = ManyBanksInterestRate;
