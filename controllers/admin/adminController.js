const createError = require('http-errors');
const News = require('../../models/news/newsModel');
const path = require('path');

const createPost = async (req, res, next) => {
	try {
		const timestamp = Math.floor(Date.now() / 1000);

		const news = new News({
			title: req.body?.title,
			timeUpdate: timestamp,
			description: req.body?.description,
			keyword: req.body?.keyword,
			originSource: req.body?.originSource,
			quotation: req.body?.quotation,
			category: req.body?.category,
			tag: req.body?.tag,
			nameAdminPost: req.body?.nameAdminPost,
			avatarAdminPost: req.body?.avatarAdminPost,
			image: `${req.protocol}://${req.get('host')}${
				process.env.pathApi
			}/postImages/${req.file.filename}`,
			content: req.body?.content,
		});

		const newsData = await news.save();

		res.status(200).send({ status: 'ok', data: newsData });
	} catch (error) {
		next(error);
	}
};

module.exports = { createPost };
