const createError = require('http-errors');
const UserInterest = require('../../models/user/userInterestModel');
const User = require('../../models/user/userModel');
const Sjc = require('../../models/gold/sjcModel');
const Coin = require('../../models/coin/coinModel');
const Hnx = require('../../models/stock/stockList/hnxModel');
const StockDetail = require('../../models/stock/stockDetail/stockDetailModel');
const News = require('../../models/news/newsModel');

const getUserWithAllPopulate = async (req, res, next) => {
	try {
		const email = req.params.email || '';

		const user = await User.find({ email })
			.select('-password')
			.populate({ path: 'followCoins', limit: 4, sort: { rank: 1 } })
			.populate({ path: 'followStocks', limit: 4, sort: { symbol: 1 } })
			.populate({ path: 'followNews', limit: 4 });

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

const getUserPopulate = async (req, res, next) => {
	try {
		const email = req.params.email || '';
		const populate = req.query.populate || '';

		const user = await User.find({ email })
			.select('-password')
			.populate(populate);

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

const getUserPopulatePagination = async (req, res, next) => {
	try {
		const email = req.params.email || '';
		const populate = req.query.populate || '';

		const perPage = req.query.per_page || 5;
		const page = req.query.page || 1;

		// if (!email) {
		// 	throw new Error('user undefined');
		// }

		const allCoinLength = await User.find({ email })
			.then((res) => res[0])
			.then((res) => res[populate]?.length)
			.catch((err) => console.log(err));
		const countPage = Math.ceil(allCoinLength / perPage);

		const user = await User.find({ email })
			.select('-password')
			.populate({
				path: populate,
				match: {},
				options: {
					skip: perPage * page - perPage,
					limit: perPage,
				},
			});

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: user,
			pages: countPage,
		});
	} catch (error) {
		next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const email = req.params.email || '';

		const user = await User.find({ email }).select('-password');

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

const getUserPopulateSymbolStock = async (req, res, next) => {
	try {
		const email = req.params.email || '';

		const user = await User.find({ email })
			.select('-password')
			.populate('followStocks', 'symbol');

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

const userFollow = async (req, res, next) => {
	const { email, itemId, category, detailModel, followCategory } = req.body;

	const followCategoryObject = {};
	followCategoryObject[followCategory] = itemId;

	if (email) {
		try {
			const data = await User.findOneAndUpdate(
				{ email },
				{ $push: followCategoryObject }
				// { upsert: true }
			)
				.then(async (result) => {
					const isExisted = UserInterest.findOne({
						email,
						category,
						detail: itemId,
					});
					if (isExisted.length > 0) {
						try {
							const data = await UserInterest.findOneAndUpdate(
								{ email, category, detail: itemId },
								{
									follow: 1,
									$inc: { score: 11, view: 1 },
								}
							);
						} catch (error) {
							console.log(error);
							const data = await User.updateOne(
								{ email },
								{ $pull: followCategoryObject }
							);
						}
					} else {
						const timestamps = Math.floor(Date.now() / 1000);
						try {
							const data = await UserInterest.findOneAndUpdate(
								{ email, category, detail: itemId },
								{
									email: email,
									category,
									detail: itemId,
									detailModel,
									follow: 1,
									time: timestamps,
									$inc: { score: 11, view: 1 },
								},
								{ upsert: true }
							);
						} catch (error) {
							console.log(error);
							const data = await User.updateOne(
								{ email },
								{ $pull: followCategoryObject }
							);
						}
					}
				})
				.catch((error) => console.log(error));

			res.status(200).send({ status: 'ok', data });
		} catch (error) {
			next(error);
		}
	} else {
		res.status(200).send({
			status: 'ok',
			data: 'you must login to update following',
		});
	}
};

const userUnfollow = async (req, res, next) => {
	const { email, itemId, category, detailModel, followCategory } = req.body;

	const followCategoryObject = {};
	followCategoryObject[followCategory] = itemId;

	if (email) {
		try {
			const data = await User.updateOne(
				{ email },
				{ $pull: followCategoryObject }
			)
				.then(async (result) => {
					try {
						const data = await UserInterest.deleteOne({
							email,
							category,
							detail: itemId,
						});
					} catch (error) {
						console.log(error);
					}
				})
				.catch((error) => console.log(error));
			res.status(200).send({ status: 'ok', data });
		} catch (error) {
			next(error);
		}
	} else {
		res.status(200).send({
			status: 'ok',
			data: 'you must login to update unfollowing',
		});
	}
};

const updateViewAndScore = async (req, res, next) => {
	const { email, itemId, category, detailModel } = req.body;
	if (email) {
		const isExisted = UserInterest.findOne({
			email,
			category: [category],
			detail: itemId,
		});
		if (isExisted.length > 0) {
			try {
				const data = await UserInterest.findOneAndUpdate(
					{ email, category: [category], detail: itemId },
					{
						$inc: { view: 1, score: 1 },
					}
				);
				res.status(200).send({ status: 'ok', data });
			} catch (error) {
				console.log(error);
			}
		} else {
			const timestamps = Math.floor(Date.now() / 1000);
			try {
				const data = await UserInterest.findOneAndUpdate(
					{ email, category: [category], detail: itemId },
					{
						email: email,
						category: [category],
						detail: itemId,
						detailModel,
						time: timestamps,
						$inc: { view: 1, score: 1 },
					},
					{ upsert: true }
				);
				res.status(200).send({ status: 'ok', data });
			} catch (error) {
				console.log(error);
			}
		}
	} else {
		res.status(200).send({
			status: 'ok',
			data: 'you must login to update score and view',
		});
	}
};

// const getUserFollowAndInterest = async (req, res, next) => {
// 	try {
// 		const { email } = req.body;

// 		const user = await User.find({ email });

// 		if (!user) {
// 			throw createError.NotFound('can not find data');
// 		}

// 		const data = await UserInterest.find({ email })
// 			.sort({ score: -1 })
// 			// .limit(20)
// 			.populate('detail');
// 		// const data = await UserInterest.aggregate([
// 		// 	{ $match: { email } },
// 		// 	// { $unwind: '$items' },
// 		// 	{ $sort: { score: -1 } },
// 		// 	{ $limit: 10 },
// 		// 	{
// 		// 		$lookup: {
// 		// 			from: 'Coins',
// 		// 			localField: 'detail',
// 		// 			foreignField: '_id',
// 		// 			as: 'detail1',
// 		// 		},
// 		// 	},
// 		// ]);

// 		res.status(200).json({
// 			status: 'ok',
// 			data: data,
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };
const getUserFollowAndInterest = async (req, res, next) => {
	try {
		const { email } = req.body;

		if (email) {
			const user = await User.find({ email });

			if (!user) {
				throw createError.NotFound('can not find data');
			}

			const data = await UserInterest.find({ email })
				.sort({ score: -1 })
				.limit(15)
				.populate('detail');
			// console.log(data);

			if (data.length > 0) {
				const categoryRank1 = data[0].category;

				const referenceRank1 = await UserInterest.find({
					email,
					category: categoryRank1,
				})
					.sort({ score: -1 })
					.skip(1)
					.limit(4)
					.populate('detail');

				res.status(200).json({
					status: 'ok',
					data: data,
					referenceRank1,
				});
			} else {
				res.status(200).json({
					status: 'ok',
					data: [],
					referenceRank1: [],
				});
			}
		} else {
			res.status(200).json({
				status: 'ok',
				data: [],
				referenceRank1: [],
			});
		}
	} catch (error) {
		next(error);
	}
};

const getRank2WithoutChartDefaultData = async (req, res, next) => {
	try {
		const arrCoin = [];
		const arrStock = [];
		const arrGold = [];

		const sjc = await Sjc.find().select('name sjc1l10lBuy');
		const finalSjc = sjc.map((item) => ({
			name: sjc[0].name,
			currentPrice: sjc[0].sjc1l10lBuy,
			tranferTo: 'VND',
			change24hPercent: '',
			href: '/gia-vang/sjc',
		}));

		const randomSkip = Math.floor(Math.random() * 50);
		const coin = await Coin.find()
			.sort({ rank: 1 })
			.collation({
				locale: 'en_US',
				numericOrdering: true,
			})
			.skip(randomSkip)
			.limit(3)
			.select('symbol nameId currentPrice priceChange24hPercent');

		const coinFinal = coin.map((item) => ({
			name: item.symbol,
			tranferTo: 'USD',
			currentPrice: item.currentPrice,
			change24hPercent: item.priceChange24hPercent,
			href: `/coin/${item.nameId}`,
		}));

		const stock = await StockDetail.find()
			.limit(3)
			.select('symbol currentPrice changePercent');

		const stockFinal = stock.map((item) => ({
			name: item.symbol,
			tranferTo: 'VND',
			currentPrice: item.currentPrice,
			change24hPercent: item.changePercent,
			href: `/co-phieu/${item.symbol}`,
		}));
		const resultData = [...finalSjc, ...coinFinal, ...stockFinal];
		res.status(200).json({
			status: 'ok',
			data: resultData,
		});
	} catch (error) {
		next(error);
	}
};

const getPreviewDataFollowOffline = async (req, res, next) => {
	try {
		const { arrIdNews, arrIdCoin, arrIdStock } = req.body;
		// const perPage = req.query.per_page || 5
		// const page = req.query.page || 1

		const coinList = await Coin.find({
			_id: {
				$in: arrIdCoin,
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

		const stockList = await StockDetail.find({
			symbol: {
				$in: arrIdStock,
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

		if (!coinList) {
			throw createError.NotFound('can not find data');
		}

		if (!stockList) {
			throw createError.NotFound('can not find data');
		}

		if (!newsList) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { coinList, stockList, newsList },
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getUserPopulate,
	getUserPopulatePagination,
	getUser,
	getUserPopulateSymbolStock,
	updateViewAndScore,
	userFollow,
	userUnfollow,
	getUserFollowAndInterest,
	getRank2WithoutChartDefaultData,
	getUserWithAllPopulate,
	getPreviewDataFollowOffline,
};
