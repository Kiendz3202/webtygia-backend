const mongoose = require('mongoose');

const coinChartMaxSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		nameId: { type: 'String' },
		data: [[Number]],
	},
	{
		timestamps: true,
	}
);

const CoinChartMax = mongoose.model('CoinChartMax', coinChartMaxSchema);

module.exports = CoinChartMax;
