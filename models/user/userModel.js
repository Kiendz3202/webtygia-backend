const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	googleId: { type: 'String', default: '' },
	name: { type: String, required: true },
	avatar: { type: String, required: true },
	email: {
		type: 'String',
		lowercase: true,
		unique: true,
		required: true,
	},
	password: {
		type: 'String',
		// required: true,
	},
	isVerified: { type: Boolean, default: false },
	role: { type: 'String', default: 'user' },
	followNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
	followCoins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coin' }],
	followStocks: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'StockDetail' },
	],
	followPetrols: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'Petrolimex' },
	],
	followGolds: [{ type: mongoose.Schema.Types.ObjectId }],
	followInterestRates: [{ type: mongoose.Schema.Types.ObjectId }],
	followExchangeRates: [{ type: mongoose.Schema.Types.ObjectId }],
	followForeignCurrency: [{ type: mongoose.Schema.Types.ObjectId }],
});

userSchema.pre('save', async function (next) {
	try {
		if (!this.googleId) {
			if (!this.isModified) {
				next();
			}
			const salt = await bcrypt.genSalt(10);
			this.password = await bcrypt.hash(this.password, salt);
			console.log(bcrypt.hash(this.password, salt));
			next();
		}
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
