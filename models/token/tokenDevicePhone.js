const mongoose = require('mongoose');

const tokenDevicePhoneSchema = mongoose.Schema(
	{
		tokenDevicePhone: {
			type: 'String',
			required: true,
			unique: true,
			default: '',
		},
		email: { type: 'String', required: true, default: '' },
	},
	{
		timestamps: true,
	}
);

const TokenDevicePhone = mongoose.model(
	'TokenDevicePhone',
	tokenDevicePhoneSchema
);
module.exports = TokenDevicePhone;
