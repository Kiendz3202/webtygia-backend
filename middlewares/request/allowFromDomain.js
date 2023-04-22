function allowFromDomain(req, res, next) {
	const allowedDomains = [`${process.env.URL_FE}`];
	const origin = req.headers.origin;
	if (allowedDomains.includes(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
		next();
	} else {
		// res.status(403).send('Forbidden');
		res.status(403).json({
			status: 'fail',
			code: 403,
			message: 'Forbidden',
		});
	}
}

module.exports = { allowFromDomain };
