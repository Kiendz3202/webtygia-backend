const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	max: 1,
	message: 'Too many connection',
	skip: (req, res) => {
		const referer = req.headers.referer;
		if (referer && referer.startsWith(`${process.env.URL_FE}`)) {
			return true; // skip rate limiting for requests coming from your website domain
		}
		return false; // apply rate limiting for all other requests
	},
	handler: function (req, res) {
		res.status(429).send({
			status: 500,
			message: 'Too many requests!',
		});
	},
});

module.exports = { apiLimiter };
