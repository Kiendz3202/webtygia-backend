const createError = require('http-errors');
const News = require('../../models/news/newsModel');
const User = require('../../models/user/userModel');

const getAllPosts = async (req, res, next) => {
	try {
		const allPost = await News.find()
			.sort({ timeUpdate: -1 })
			.select(' -createdAt -updatedAt -__v');

		res.status(200).json({
			status: 'ok',
			data: allPost,
		});
	} catch (error) {
		next(error);
	}
};

const getLatestPosts = async (req, res, next) => {
	try {
		const allPost = await News.find()
			.sort({ timeUpdate: -1 })
			.limit(6)
			.select(' -createdAt -updatedAt -__v');

		res.status(200).json({
			status: 'ok',
			data: allPost,
		});
	} catch (error) {
		next(error);
	}
};

const getPaginationPosts = async (req, res, next) => {
	try {
		const perPage = req.query.per_page || 25;
		const page = req.query.page || 1;
		if (
			!(
				Number.isInteger(parseFloat(perPage)) && parseFloat(perPage) > 0
			) ||
			!(Number.isInteger(parseFloat(page)) && parseFloat(page) > 0)
		) {
			throw createError.BadRequest(
				'query per_page and page must be integer and larger than 0'
			);
		}
		const allPost = await News.find();
		const allPostLength = allPost.length - 4;
		const countPage = Math.ceil(allPostLength / perPage);

		//-------------pagination by mongoose------------------------
		const newsList = await News.find({})
			.sort({ timeUpdate: -1 })
			.skip(4 + perPage * page - perPage)
			.limit(perPage)
			.select('-createdAt -updatedAt -__v');

		if (!newsList) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { newsList, pages: countPage },
		});
	} catch (error) {
		next(error);
	}
};

const getDetailPost = async (req, res, next) => {
	try {
		const id = req.params.id;
		// console.log(typeof id);

		const news = await News.find({
			timeUpdate: id,
		})
			// .populate(
			// 	'companyInfo',
			// 	'-_id -createdAt -updatedAt -__v -name -symbol'
			// )
			.select(' -createdAt -updatedAt -__v');

		if (!news) {
			throw createError.NotFound('can not find data');
		}
		// console.log(news);
		res.status(200).json({ status: 'ok', data: news });
	} catch (error) {
		next(error);
	}
};

const userFollowNews = async (req, res, next) => {
	const { email, newsId } = req.body;

	try {
		const data = await User.findOneAndUpdate(
			{ email },
			{ $push: { followNews: newsId } }
			// { upsert: true }
		);

		res.status(200).send({ status: 'ok', data });
	} catch (error) {
		next(error);
	}
};

const userUnfollowNews = async (req, res, next) => {
	const { email, newsId } = req.body;

	try {
		const data = await User.updateOne(
			{ email },
			{ $pull: { followNews: newsId } }
		);

		res.status(200).send({ status: 'ok', data });
	} catch (error) {
		next(error);
	}
};

const getNewsFollowOffline = async (req, res, next) => {
	try {
		const { arrIdNews } = req.body;

		const newsList = await News.find({
			_id: {
				$in: arrIdNews,
			},
		})
			// .sort({ rank: 1 })
			// .collation({
			// 	locale: 'en_US',
			// 	numericOrdering: true,
			// })
			// .skip(perPage * page - perPage)
			// .limit(perPage)
			.select(' -createdAt -updatedAt -__v');

		if (!newsList) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { newsList },
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllPosts,
	getLatestPosts,
	getPaginationPosts,
	getDetailPost,
	userFollowNews,
	userUnfollowNews,
	getNewsFollowOffline,
};
