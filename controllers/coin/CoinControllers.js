const Coin = require('../../models/coin/coinModel');
// const CoinChart = require('../../models/coin/chartCoin/chartCoinModel');
const CoinDescription = require('../../models/coin/coinDescriptionModel');
const CoinChart1D = require('../../models/coin/chartCoin/chart1DModel');
const CoinChart90D = require('../../models/coin/chartCoin/chart90DModel');
const CoinChartMax = require('../../models/coin/chartCoin/chartMaxModel');
const createError = require('http-errors');
const User = require('../../models/user/userModel');
const UserInterest = require('../../models/user/userInterestModel');

const paginationPageCoinController = async (req, res, next) => {
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
		const allCoinLength = await Coin.count();
		const countPage = Math.ceil(allCoinLength / perPage);

		//-------------pagination by mongoose------------------------
		const coinList = await Coin.find({})
			.sort({ rank: 1 })
			.collation({
				locale: 'en_US',
				numericOrdering: true,
			})
			.skip(perPage * page - perPage)
			.limit(perPage)
			.select(' -createdAt -updatedAt -__v');

		if (!coinList) {
			throw createError.NotFound('can not find data');
		}
		//aggregrate to response data chart to coinlist
		const arr = [];
		coinList.forEach((coin) => {
			arr.push(coin.nameId);
		});
		// console.time('aggregrate');
		const dataChart = await CoinChart90D.aggregate([
			{
				$match: {
					$expr: { $in: ['$nameId', arr] },
				},
			},
			{
				// $project: {
				// 	_id: 0,
				// 	t: { $slice: ['$t', -24] },
				// 	price: { $slice: ['$price', -24] },
				// 	nameId: 1,
				// },
				$project: {
					_id: 1,
					data: { $slice: ['$data', -24] },
					nameId: 1,
				},
			},
		]);
		// console.log(dataChart);
		// console.timeEnd('aggregrate');
		res.status(200).json({
			status: 'ok',
			data: { coinList, dataChart, pages: countPage },
		});
	} catch (error) {
		next(error);
	}
};

const detailCoinController = async (req, res, next) => {
	try {
		const coinNameId = req.params.nameId || 'bitcoin';

		const coinDetail = await Coin.find({ nameId: coinNameId }).select(
			' -createdAt -updatedAt -__v'
		);

		if (!coinDetail) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({ status: 'ok', data: coinDetail });
	} catch (error) {
		next(error);
	}
};

const coinChartController = async (req, res, next) => {
	try {
		const coinNameId = req.params.nameId || 'bitcoin';
		const days = req.query.days || 1;

		if (parseInt(days) !== 1 && parseInt(days) !== 90 && days !== 'max') {
			throw createError.BadRequest('query days must be 1, 90, max');
		}
		let chartData;
		if (parseInt(days) === 1) {
			chartData = await CoinChart1D.find({ nameId: coinNameId }).select(
				' -__v -createdAt -updatedAt'
			);

			if (!chartData) {
				throw createError.NotFound('can not find data');
			}
		}

		if (parseInt(days) === 90) {
			chartData = await CoinChart90D.find({ nameId: coinNameId }).select(
				' -__v -createdAt -updatedAt'
			);

			if (!chartData) {
				throw createError.NotFound('can not find data');
			}
		}

		if (days === 'max') {
			chartData = await CoinChartMax.find({ nameId: coinNameId }).select(
				' -__v -createdAt -updatedAt'
			);

			if (!chartData) {
				throw createError.NotFound('can not find data');
			}
		}

		res.status(200).json({ status: 'ok', data: chartData });
	} catch (error) {
		next(error);
	}
};

const getCoinTopRank = async (req, res, next) => {
	const coinList = await Coin.find(
		{},
		{
			nameId: 1,
			symbol: 1,
			name: 1,
			currentPrice: 1,
			priceChange1hPercent: 1,
			image: 1,
			rank: 1,
			_id: 0,
		}
	)
		.sort({ rank: 1 })
		.collation({
			locale: 'en_US',
			numericOrdering: true,
		})
		.limit(7);
	// .select(' -createdAt -updatedAt -__v');

	if (!coinList) {
		throw createError.NotFound('can not find data');
	}

	res.status(200).json({
		status: 'ok',
		data: coinList,
	});
};

const getCoinDescription = async (req, res, next) => {
	const nameId = req.params.nameId;
	const coinDescription = await CoinDescription.find({
		nameId: nameId,
	}).select(' -createdAt -updatedAt -__v');

	//test
	const coinData = await Coin.find({ nameId: nameId });
	//

	if (!coinDescription) {
		throw createError.NotFound('can not find data');
	}

	res.status(200).json({
		status: 'ok',
		data: coinDescription,
		coinData,
		seo: {
			vonhoa: 'Vốn hoá',
			vonhoathitruongphaloanghoantoan:
				'Vốn hoá thị trường pha loãng hoàn toàn',
			luongcungluuhanh: 'Lượng cung lưu hành',
			tongcungtoida: 'Tổng cung tối đa',
			khoiluonggiaodich24gio: 'Khối lượng giao dịch 24h',
			congcuchuyendoitiente: 'Công cụ chuyển đổi tiền tệ',
			bieudo: 'Biểu đồ',
			dulieuvegiatheothoigianthuc: 'Dữ liệu về giá theo thời gian thực',
			description:
				'Giá  hôm nay là  USD với khối lượng giao dịch trong 24 giờ là $ USD. Chúng tôi cập nhật  của chúng tôi sang giá USD theo thời gian thực.  giảm % trong 24 giờ qua. Thứ hạng hiện tại trên là #, với vốn hóa thị trường là $ USD. Lượng cung lưu hành là  đồng coin và lượng cung tối đa là  đồng coin.',
		},
	});
};

// const userFollowCoins = async (req, res, next) => {
// 	const { email, coinsId } = req.body;

// 	try {
// 		const data = await User.findOneAndUpdate(
// 			{ email },
// 			{ $push: { followCoins: coinsId } }
// 			// { upsert: true }
// 		)
// 			.then(async (result) => {
// 				const isExisted = UserInterest.findOne({
// 					email,
// 					category: 'coin',
// 					detail: coinsId,
// 				});
// 				if (isExisted.length > 0) {
// 					try {
// 						const data = await UserInterest.findOneAndUpdate(
// 							{ email, category: 'coin', detail: coinsId },
// 							{
// 								follow: 1,
// 								$inc: { score: 11, view: 1 },
// 							}
// 						);
// 					} catch (error) {
// 						console.log(error);
// 						const data = await User.updateOne(
// 							{ email },
// 							{ $pull: { followCoins: coinsId } }
// 						);
// 					}
// 				} else {
// 					const timestamps = Math.floor(Date.now() / 1000);
// 					try {
// 						const data = await UserInterest.findOneAndUpdate(
// 							{ email, category: 'coin', detail: coinsId },
// 							{
// 								email: email,
// 								category: 'coin',
// 								detail: coinsId,
// 								detailModel: 'Coin',
// 								follow: 1,
// 								time: timestamps,
// 								$inc: { score: 11, view: 1 },
// 							},
// 							{ upsert: true }
// 						);
// 					} catch (error) {
// 						console.log(error);
// 						const data = await User.updateOne(
// 							{ email },
// 							{ $pull: { followCoins: coinsId } }
// 						);
// 					}
// 				}
// 			})
// 			.catch((error) => console.log(error));

// 		res.status(200).send({ status: 'ok', data });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const userUnfollowCoins = async (req, res, next) => {
// 	const { email, coinsId } = req.body;

// 	try {
// 		const data = await User.updateOne(
// 			{ email },
// 			{ $pull: { followCoins: coinsId } }
// 		)
// 			.then(async (result) => {
// 				try {
// 					const data = await UserInterest.deleteOne({
// 						email,
// 						category: 'coin',
// 						detail: coinsId,
// 					});
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			})
// 			.catch((error) => console.log(error));
// 		res.status(200).send({ status: 'ok', data });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const updateViewAndScore = async (req, res, next) => {
// 	const { email, itemId, category, detailModel } = req.body;
// 	const isExisted = UserInterest.findOne({
// 		email,
// 		category,
// 		detail: itemId,
// 	});
// 	if (isExisted.length > 0) {
// 		try {
// 			const data = await UserInterest.findOneAndUpdate(
// 				{ email, category, detail: itemId },
// 				{
// 					$inc: { view: 1, score: 1 },
// 				}
// 			);
// 			res.status(200).send({ status: 'ok', data });
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	} else {
// 		const timestamps = Math.floor(Date.now() / 1000);
// 		try {
// 			const data = await UserInterest.findOneAndUpdate(
// 				{ email, category, detail: itemId },
// 				{
// 					email: email,
// 					category,
// 					detail: itemId,
// 					detailModel,
// 					time: timestamps,
// 					$inc: { view: 1, score: 1 },
// 				},
// 				{ upsert: true }
// 			);
// 			res.status(200).send({ status: 'ok', data });
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}
// };

const getUserCoinReference = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.find({ email });

		if (!user) {
			throw createError.NotFound('can not find data');
		}

		const data = await UserInterest.find({
			email,
			detailModel: 'Coin',
		}).populate('detail');
		res.status(200).json({
			status: 'ok',
			data: data,
		});
	} catch (error) {
		next(error);
	}
};
const getCoinReference = async (req, res, next) => {
	try {
		const skipRandom = Math.floor(Math.random() * 100);
		const data = await Coin.find(
			{},
			{
				nameId: 1,
				symbol: 1,
				name: 1,
				currentPrice: 1,
				priceChange1hPercent: 1,
				image: 1,
				rank: 1,
				_id: 0,
			}
		)
			.sort({ rank: 1 })
			.collation({
				locale: 'en_US',
				numericOrdering: true,
			})
			.skip(skipRandom)
			.limit(4);

		res.status(200).json({
			status: 'ok',
			data: data,
		});
	} catch (error) {
		next(error);
	}
};

const getCoinFollowOffline = async (req, res, next) => {
	try {
		const { arrIdCoin } = req.body;

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

		if (!coinList) {
			throw createError.NotFound('can not find data');
		}

		res.status(200).json({
			status: 'ok',
			data: { coinList },
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	paginationPageCoinController,
	detailCoinController,
	coinChartController,
	getCoinTopRank,
	getCoinDescription,
	getUserCoinReference,
	getCoinReference,
	getCoinFollowOffline,
	// userFollowCoins,
	// userUnfollowCoins,
	// updateViewAndScore,
};
