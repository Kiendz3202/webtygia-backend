const mongoose = require('mongoose');

const usdVietombankChartSchema = mongoose.Schema(
	{
		name: { type: 'String' },
		t: [Number],
		price: [Number],
	},
	{
		timestamps: true,
	}
);

const UsdVietombankChart = mongoose.model(
	'UsdVietombankChart',
	usdVietombankChartSchema
);
module.exports = UsdVietombankChart;
