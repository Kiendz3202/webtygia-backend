const mongoose = require('mongoose');

const tokenVerifyEmailSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true,
	},
	token: { type: 'String', required: true },
	createdAt: { type: Date, default: Date.now(), expires: 3600 }, // 1 hour
});

const TokenVerifyEmail = mongoose.model(
	'TokenVerifyEmail',
	tokenVerifyEmailSchema
);
module.exports = TokenVerifyEmail;
