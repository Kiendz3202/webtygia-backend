const mongoose = require('mongoose');

const techcombankExchangeSchema = mongoose.Schema(
	{
		name: {
			type: 'String',
			default: 'Ngân hàng Thương mại cổ phần Kỹ Thương Việt Nam',
		},
		symbol: { type: 'String', default: 'Techcombank' },
		timeUpdate: { type: 'String' },

		usdBuyCast: { type: 'String' },
		usdBuyTransfer: { type: 'String' },
		usdSell: { type: 'String' },

		eurBuyCast: { type: 'String' },
		eurBuyTransfer: { type: 'String' },
		eurSell: { type: 'String' },

		audBuyCast: { type: 'String' },
		audBuyTransfer: { type: 'String' },
		audSell: { type: 'String' },

		cadBuyCast: { type: 'String' },
		cadBuyTransfer: { type: 'String' },
		cadSell: { type: 'String' },

		chfBuyCast: { type: 'String' },
		chfBuyTransfer: { type: 'String' },
		chfSell: { type: 'String' },

		cnyBuyCast: { type: 'String' },
		cnyBuyTransfer: { type: 'String' },
		cnySell: { type: 'String' },

		gbpBuyCast: { type: 'String' },
		gbpBuyTransfer: { type: 'String' },
		gbpSell: { type: 'String' },

		hkdBuyCast: { type: 'String' },
		hkdBuyTransfer: { type: 'String' },
		hkdSell: { type: 'String' },

		jpyBuyCast: { type: 'String' },
		jpyBuyTransfer: { type: 'String' },
		jpySell: { type: 'String' },

		krwBuyCast: { type: 'String' },
		krwBuyTransfer: { type: 'String' },
		krwSell: { type: 'String' },

		sgdBuyCast: { type: 'String' },
		sgdBuyTransfer: { type: 'String' },
		sgdSell: { type: 'String' },

		thbBuyCast: { type: 'String' },
		thbBuyTransfer: { type: 'String' },
		thbSell: { type: 'String' },
	},
	{
		timestamps: true,
	}
);

const TechcombankExchange = mongoose.model(
	'TechcombankExchange',
	techcombankExchangeSchema
);
module.exports = TechcombankExchange;
