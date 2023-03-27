const mongoose = require('mongoose');

const coinChart90DSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		nameId: { type: 'String' },
		data: [[Number]],
	},
	{
		timestamps: true,
	}
);

const CoinChart90D = mongoose.model('CoinChart90D', coinChart90DSchema);

module.exports = CoinChart90D;
