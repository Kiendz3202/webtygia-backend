const JWT = require('jsonwebtoken');
const createError = require('http-errors');

//middleware sẽ cho ở trước tất cả các request cần access token
const verifyToken = (req, res, next) => {
	if (!req.headers['authorization']) {
		return next(createError.Unauthorized());
	}
	const authHeader = req.headers['authorization'];
	const bearerToken = authHeader.split(' ');
	const token = bearerToken[1];
	//verify token
	JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
		if (err) {
			if (err.name === 'JsonWebTokenError') {
				return next(createError.Unauthorized());
			}
			return next(err);
		}
		req.payload = payload;
		next();
	});
};

module.exports = { verifyToken };
