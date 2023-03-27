const mongoose = require('mongoose');

const stockChart6MSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		t: [Number],
		price: [Number],
	},
	{
		timestamps: true,
	}
);

const StockChart6M = mongoose.model('StockChart6M', stockChart6MSchema);
module.exports = StockChart6M;

// 1Week - timeframe 15p
// 6thang - timeframe 1h
// max - timeframe 1d
