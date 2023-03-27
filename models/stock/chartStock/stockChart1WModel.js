const mongoose = require('mongoose');

const stockChart1WSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		t: [Number],
		price: [Number],
	},
	{
		timestamps: true,
	}
);

const StockChart1W = mongoose.model('StockChart1W', stockChart1WSchema);
module.exports = StockChart1W;

// 1Week - timeframe 15p
// 6thang - timeframe 1h
// max - timeframe 1d
