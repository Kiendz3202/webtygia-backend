const mongoose = require('mongoose');

const userInterestSchema = mongoose.Schema(
	{
		email: {
			type: 'String',
			lowercase: true,
			required: true,
		},
		category: {
			type: [
				{
					type: String,
					enum: [
						'news',
						'coin',
						'stock',
						'gold',
						'interest-rate',
						'exchange-rate',
						'foreign-currency',
						'petrol',
					],
				},
			],
		},
		detail: {
			type: mongoose.Schema.Types.ObjectId,
			require: true,
			refPath: 'detailModel',
		},
		detailModel: {
			type: String,
			required: true,
			enum: [
				'News',
				'Coin',
				'StockDetail',
				'Petrolimex',
				'AgribankInterestRate',
				'BidvInterestRate',
				'MbbankInterestRate',
				'ScbInterestRate',
				'VibInterestRate',
				'VietcombankInterestRate',
				'VietinbankInterestRate',
				'AgribankExchange',
				'BidvExchange',
				'MbbankExchange',
				'TechcombankExchange',
				'VietcombankExchange',
				'VietinBankExchange',
				'ExchangeUsdToVnd',
				'BaoTinMinhChau',
				'Doji',
				'MiHong',
				'PhuQuySjc',
				'Pnj',
				'Sjc',
			],
		},
		view: { type: Number, default: 0 },
		follow: { type: Number, default: 0 },
		time: { type: String },
		score: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

const UserInterest = mongoose.model('UserInterest', userInterestSchema);
module.exports = UserInterest;
