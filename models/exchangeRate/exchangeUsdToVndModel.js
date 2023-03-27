const mongoose = require('mongoose');

const exchangeUsdToVndSchema = mongoose.Schema(
	{
		symbol: { type: 'String', default: 'Vietcombank' },
		name: { type: 'String', default: 'USD (Đô La Mỹ)' },
		timeUpdate: { type: 'String' },

		usdBuyCast: { type: 'String' },
		usdBuyTransfer: { type: 'String' },
		usdSell: { type: 'String' },
	},
	{
		timestamps: true,
	}
);

const ExchangeUsdToVnd = mongoose.model(
	'ExchangeUsdToVnd',
	exchangeUsdToVndSchema
);
module.exports = ExchangeUsdToVnd;
