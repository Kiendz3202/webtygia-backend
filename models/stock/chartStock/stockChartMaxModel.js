const mongoose = require('mongoose');

const stockChartMaxSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		t: [Number],
		price: [Number],
	},
	{
		timestamps: true,
	}
);

const StockChartMax = mongoose.model('StockChartMax', stockChartMaxSchema);
module.exports = StockChartMax;

// 1Week - timeframe 15p
// 6thang - timeframe 1h
// max - timeframe 1d
