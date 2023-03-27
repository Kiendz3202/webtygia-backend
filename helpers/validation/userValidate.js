const Joi = require('joi');

const userValidate = (data, type) => {
	if (type === 'signup') {
		const userSchema = Joi.object({
			name: Joi.string().min(2).max(25).required(),
			// avatar: Joi.required(),
			email: Joi.string().email().lowercase().required(),
			password: Joi.string().min(6).max(32).required(),
		});
		return userSchema.validate(data);
	}
	if (type === 'login') {
		const userSchema = Joi.object({
			email: Joi.string().email().lowercase().required(),
			password: Joi.string().min(6).max(32).required(),
			tokenDevicePhone: Joi.string() || undefined,
		});
		return userSchema.validate(data);
	}
};

module.exports = { userValidate };
