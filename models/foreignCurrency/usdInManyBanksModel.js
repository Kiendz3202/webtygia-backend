const mongoose = require('mongoose');

const usdInManyBanksSchema = mongoose.Schema(
	{
		symbol: { type: 'String', default: 'USD' },
		timeUpdate: { type: 'String' },
		data: { type: Array, default: [] },
	},
	{
		timestamps: true,
	}
);

const UsdInManyBanks = mongoose.model('UsdInManyBanks', usdInManyBanksSchema);
module.exports = UsdInManyBanks;
