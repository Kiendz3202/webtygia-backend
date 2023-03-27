const mongoose = require('mongoose');

//coins/markets đáp ứng đủ cái này nhưng chỉ 1 loại usd or vnd chứ k lấy dc giá của cả 2 loại tiên

const coinSchema = mongoose.Schema(
	{
		name: { type: 'String' },
		nameId: { type: 'String' },
		symbol: { type: 'String' },
		image: { type: 'String' },
		priceChange1hPercent: { type: 'String' },
		priceChange24hPercent: { type: 'String' },
		priceChange7dPercent: { type: 'String' },
		priceChange14dPercent: { type: 'String' },
		priceChange30dPercent: { type: 'String' },
		priceChange200dPercent: { type: 'String' },
		priceChange1yPercent: { type: 'String' },
		volume24h: { type: 'String' },
		marketCap: { type: 'String' },
		high24h: { type: 'String' },
		low24h: { type: 'String' },
		ath: { type: 'String' },
		atl: { type: 'String' },
		fullyDilutedValuation: { type: 'String' },
		circulatingSupply: { type: 'String' },
		totalSupply: { type: 'String' },
		maxSupply: { type: 'String' },
		currentPrice: { type: 'String' },
		rank: { type: 'String' },
	},
	{
		timestamps: true,
	}
);

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
