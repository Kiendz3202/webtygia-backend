const mongoose = require('mongoose');

const petrolimexChartSchema = mongoose.Schema(
	{
		name: { type: 'String' },
		type: { type: 'String' },
		t: [Number],
		price: [Number],
	},
	{
		timestamps: true,
	}
);

const PetrolimexChart = mongoose.model(
	'PetrolimexChart',
	petrolimexChartSchema
);
module.exports = PetrolimexChart;
