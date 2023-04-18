const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const {
	pushNewDataToCoinChart,
} = require('../../helpers/updateDataToDb/coin/updateCoinToDb');
const { delay } = require('../../utils/promise/delay');

const Coin = require('../../../../models/coin/coinModel');
// const CoinChart = require('../../../../models/coin/chartCoin/chartCoinModel');
const CoinChart1D = require('../../../../models/coin/chartCoin/chart1DModel');
const CoinChart90D = require('../../../../models/coin/chartCoin/chart90DModel');
const CoinChartMax = require('../../../../models/coin/chartCoin/chartMaxModel');
const CoinDescription = require('../../../../models/coin/coinDescriptionModel');

const { crawlCoinList } = require('./crawlCoinList');
const {
	crawlCoinChart1D,
	crawlCoinChart90D,
	crawlCoinChartMax,
} = require('./crawlCoinChart');
const {
	crawlCoinDescription,
	crawlCoinDescriptionTranslateToVN,
} = require('./crawlCoinDescription');
const { getCoinListAPI } = require('../../configs/constants/coin');

const startCrawlCoinListAndChart = async () => {
	const initialCoin = await Coin.find({});
	const initialCoinChart1D = await CoinChart1D.find(
		{},
		{ nameId: 1, _id: 0 }
	);
	const initialCoinChart90D = await CoinChart90D.find(
		{},
		{ nameId: 1, _id: 0 }
	);
	const initialCoinChartMax = await CoinChartMax.find(
		{},
		{ nameId: 1, _id: 0 }
	);
	const initialCoinDescription = await CoinDescription.find(
		{},
		{ nameId: 1, _id: 0 }
	);

	//crawl 200 coins * 4 = 800 coins
	const arr = [1, 2, 3, 4];
	let allCoinListUpdate = [];
	while (allCoinListUpdate.length < arr.length * 200 - 10) {
		allCoinListUpdate = [];
		for (const page of arr) {
			const coinListUpdate = await crawlCoinList(200, page); //200 coins/ 1api call
			await delay(30000);
			if (coinListUpdate && coinListUpdate.length > 0) {
				allCoinListUpdate = allCoinListUpdate.concat(coinListUpdate);
			}
		}
		await delay(120000);
	}
	// await delay(120000); //40000
	//remove and upsert when update Coin(when Coin is not empty)
	if (initialCoin.length) {
		const listCoinCurrent = await Coin.find({});
		// console.log(listCoinCurrent.length);
		// console.log(allCoinListUpdate.length);

		if (allCoinListUpdate.length > 790) {
			const coinNeedRemove = listCoinCurrent?.filter(
				(coin) =>
					!allCoinListUpdate?.find((item) => coin.nameId == item?.id)
			);
			// console.log('coinlist need remove');
			let countNeedRemove = 0;

			for (const coin of coinNeedRemove) {
				await Coin.deleteOne({ nameId: coin.nameId }).catch((err) =>
					console.log(err)
				);
				countNeedRemove++;
			}
			// console.log(countNeedRemove);
			// console.log('end coinlist need remove');
		}
	}

	//remove coins in  CoinChart which dont exist in Coin when update(when CoinChart is not empty)
	if (initialCoinChart1D.length != 0) {
		const arrCoinNew = await Coin.find({}, { nameId: 1, _id: 0 });
		// console.log(arrCoinNew.length);

		const coinNeedRemoveCoinChart1D = initialCoinChart1D.filter(
			(coin) => !arrCoinNew.find(({ nameId }) => coin.nameId == nameId)
		);
		const coinNeedRemoveCoinChart90D = initialCoinChart90D.filter(
			(coin) => !arrCoinNew.find(({ nameId }) => coin.nameId == nameId)
		);
		const coinNeedRemoveCoinChartMax = initialCoinChartMax.filter(
			(coin) => !arrCoinNew.find(({ nameId }) => coin.nameId == nameId)
		);
		const coinNeedRemoveCoinDescription = initialCoinDescription.filter(
			(coin) => !arrCoinNew.find(({ nameId }) => coin.nameId == nameId)
		);
		console.log('coinchart need remove');
		// let countNeedRemove = 0;
		coinNeedRemoveCoinChart1D.map((coin) => {
			CoinChart1D.deleteOne({ nameId: coin.nameId }).catch((err) =>
				console.log(err.message)
			);
		});
		coinNeedRemoveCoinChart90D.map((coin) => {
			CoinChart90D.deleteOne({ nameId: coin.nameId }).catch((err) =>
				console.log(err.message)
			);
		});
		coinNeedRemoveCoinChartMax.map((coin) => {
			CoinChartMax.deleteOne({ nameId: coin.nameId }).catch((err) =>
				console.log(err.message)
			);
		});
		coinNeedRemoveCoinDescription.map((coin) => {
			CoinDescription.deleteOne({ nameId: coin.nameId }).catch((err) =>
				console.log(err.message)
			);
		});
		// console.log(countNeedRemove);
		// console.log('end coinchart need remove');
	}

	const coinChartIsEmty = (await CoinChart1D.count()) ? false : true;
	const currentCoin = await Coin.find({}, { symbol: 1, nameId: 1, _id: 0 });

	//update,add new datachart to CoinChart(when CoinChart is empty)
	if (coinChartIsEmty) {
		// console.log('start coinChartIsEmty');
		// console.log(currentCoin.length);

		for (const coin of currentCoin) {
			crawlCoinDescription(coin);
			await delay(30000);
			crawlCoinChart90D(coin);
			await delay(30000);
			crawlCoinChartMax(coin);
			await delay(30000);
			crawlCoinChart1D(coin);
			await delay(30000);
		}
		// console.log('end coinChartIsEmty');
	} else {
		//upsert,add new datachart to CoinChart(when CoinChart is not empty)
		// const currentCoinChart = await CoinChart1D.find(
		// 	{},
		// 	{ symbol: 1, nameId: 1, _id: 0 }
		// );

		// const coinChartNeedupdate = currentCoin.filter(
		// 	(coin) =>
		// 		!currentCoinChart.find(({ nameId }) => coin.nameId == nameId)
		// );
		// console.log('coin need update');
		// let countNeedUpdate = 0;

		// for (const coin of coinChartNeedupdate) {
		// 	countNeedUpdate++;
		// 	crawlCoinDescription(coin);
		// 	await delay(30000);
		// 	crawlCoinDescriptionTranslateToVN(coin);
		// 	crawlCoinChart90D(coin);
		// 	await delay(30000);
		// 	crawlCoinChartMax(coin);
		// 	await delay(30000);
		// 	crawlCoinChart1D(coin);
		// 	await delay(30000);
		// }
		// console.log(countNeedUpdate);
		// console.log('end coin need update');

		//==================New code===================
		const getCoinNewNeedUpsert = async (model) => {
			const currentCoinChart = await model.find(
				{},
				{ symbol: 1, nameId: 1, _id: 0 }
			);

			const coinChartNeedupdate = currentCoin.filter(
				(coin) =>
					!currentCoinChart.find(
						({ nameId }) => coin.nameId == nameId
					)
			);

			return coinChartNeedupdate;
		};
		//
		const coinChartNeedupdate1D = await getCoinNewNeedUpsert(CoinChart1D);
		const coinChartNeedupdate90D = await getCoinNewNeedUpsert(CoinChart90D);
		const coinChartNeedupdateMax = await getCoinNewNeedUpsert(CoinChartMax);
		const coinChartNeedupdateDescription = await getCoinNewNeedUpsert(
			CoinDescription
		);

		for (const coin of coinChartNeedupdate1D) {
			crawlCoinChart1D(coin);
			await delay(30000);
		}
		for (const coin of coinChartNeedupdate90D) {
			crawlCoinChart90D(coin);
			await delay(30000);
		}
		for (const coin of coinChartNeedupdateMax) {
			crawlCoinChartMax(coin);
			await delay(30000);
		}
		for (const coin of coinChartNeedupdateDescription) {
			crawlCoinDescription(coin);
		}
	}
};

const updateCoinListAndChartTimeframe5Minute = async () => {
	// const coinIsEmty = (await Coin.count()) ? false : true;
	// const coinChartIsEmty = (await CoinChart1D.count()) ? false : true;

	// if (!coinIsEmty) {
	//crawl 200 coins * 6 pages = 1200 coins
	const arr = [1, 2, 3, 4, 5, 6];

	for (const page of arr) {
		axios
			.get(getCoinListAPI(200, page))
			.then((response) => {
				response.data.map(async (coin) => {
					Coin.findOneAndUpdate(
						{ nameId: coin?.id },
						{
							name: coin?.name || '',
							symbol: coin?.symbol || '',
							nameId: coin?.id || '',
							image: coin?.image || '',
							priceChange1hPercent:
								coin?.price_change_percentage_1h_in_currency ||
								'',
							priceChange24hPercent:
								coin?.price_change_percentage_24h_in_currency ||
								'',
							priceChange7dPercent:
								coin?.price_change_percentage_7d_in_currency ||
								'',
							priceChange14dPercent:
								coin?.price_change_percentage_14d_in_currency ||
								'',
							priceChange30dPercent:
								coin?.price_change_percentage_30d_in_currency ||
								'',
							priceChange200dPercent:
								coin?.price_change_percentage_200d_in_currency ||
								'',
							priceChange1yPercent:
								coin?.price_change_percentage_1y_in_currency ||
								'',
							volume24h: coin?.total_volume || '',
							marketCap: coin?.market_cap || '',
							currentPrice: coin?.current_price || '',
							high24h: coin?.high_24h || '',
							low24h: coin?.low_24h || '',
							ath: coin?.ath || '',
							atl: coin?.atl || '',
							fullyDilutedValuation:
								coin?.fully_diluted_valuation || '',
							rank: coin?.market_cap_rank || '',
							circulatingSupply: coin?.circulating_supply || '',
							totalSupply: coin?.total_supply || '',
							maxSupply: coin?.max_supply || '',
						}
						// { upsert: true }
					)
						// .then((doc) => console.log(doc?.name))
						.catch((err) => console.log(err.message));

					// if (!coinChartIsEmty) {
					pushNewDataToCoinChart(coin, CoinChart1D, 290);
					// }
				});
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						err.message +
						' update chart coin 5 minute'
				);
			});
		await delay(20000);
	}
	// }
};

const updateCoinListAndChartTimeframe1Hour = async () => {
	// const coinIsEmty = (await Coin.count()) ? false : true;
	// const coinChartIsEmty = (await CoinChart1D.count()) ? false : true;

	// if (!coinIsEmty) {
	//crawl 200 coins * 6 pages = 1200 coins
	const arr = [1, 2, 3, 4, 5, 6];

	for (const page of arr) {
		axios
			.get(getCoinListAPI(200, page))
			.then((response) => {
				response.data.map(async (coin) => {
					// if (!coinChartIsEmty) {
					pushNewDataToCoinChart(coin, CoinChart90D, 2100);
					// }
				});
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						err.message +
						' update chart coin 1 hour'
				);
			});
		await delay(20000);
	}
	// }
};

const updateCoinListAndChartTimeframe1Day = async () => {
	// const coinIsEmty = (await Coin.count()) ? false : true;
	// const coinChartIsEmty = (await CoinChart1D.count()) ? false : true;

	// if (!coinIsEmty) {
	//crawl 200 coins * 6 pages = 1200 coins
	const arr = [1, 2, 3, 4, 5, 6];

	for (const page of arr) {
		axios
			.get(getCoinListAPI(200, page))
			.then((response) => {
				response.data.map(async (coin) => {
					// if (!coinChartIsEmty) {
					pushNewDataToCoinChart(coin, CoinChartMax, 3000);
					// }
				});
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						err.message +
						' crawl list coin'
				);
			});
		await delay(20000);
	}
	// }
};
module.exports = {
	startCrawlCoinListAndChart,
	updateCoinListAndChartTimeframe5Minute,
	updateCoinListAndChartTimeframe1Hour,
	updateCoinListAndChartTimeframe1Day,
};
