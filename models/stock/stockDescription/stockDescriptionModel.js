const mongoose = require('mongoose');

const stockDescriptionSchema = mongoose.Schema(
	{
		symbol: { type: 'String' },
		image: { type: 'String' },
		vnName: { type: 'String', default: '' },
		enName: { type: 'String', default: '' },
		foundDate: { type: 'String', default: '' },
		taxCode: { type: 'String', default: '' },
		registrationCode: { type: 'String', default: '' },
		address: { type: 'String', default: '' },
		phone: { type: 'String', default: '' },
		fax: { type: 'String', default: '' },
		website: { type: 'String', default: '' },
		email: { type: 'String', default: '' },
		employees: { type: 'String', default: '' },
		description: { type: 'String', default: '' },
	},
	{
		timestamps: true,
	}
);

const StockDescription = mongoose.model(
	'StockDescription',
	stockDescriptionSchema
);

module.exports = StockDescription;
