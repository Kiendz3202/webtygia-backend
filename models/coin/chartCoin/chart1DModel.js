const mongoose = require('mongoose');

const coinChart1DSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		nameId: { type: 'String' },
		data: [[Number]],
	},
	{
		timestamps: true,
	}
);

const CoinChart1D = mongoose.model('CoinChart1D', coinChart1DSchema);

module.exports = CoinChart1D;
