const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const { delay } = require('../../utils/promise/delay');

const {
	getCoinDescription,
	getCoinDescriptionTranslateToVN,
} = require('../../configs/constants/coin');

const CoinDescription = require('../../../../models/coin/coinDescriptionModel');
const {
	updateCoinDescription,
	updateCoinDescriptionTranslateToVN,
} = require('../../helpers/updateDataToDb/coin/updateCoinToDb');
const {
	translateByGoogleApi,
} = require('../../../../utils/translate/translateByGoogleAPI');

const crawlCoinDescription = async (coin) => {
	axios
		.get(getCoinDescription(coin.nameId))
		.then(async (response) => {
			const data = response.data;
			const translatedDes = await translateByGoogleApi(
				'en',
				'vi',
				data.description.en
			);

			data.description.en = translatedDes;
			// updateCoinChart(coin, data, CoinChart1D);
			// console.log(data);
			updateCoinDescription(data, CoinDescription);
		})
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					err.message +
					' crawl description coin'
			);
		});
};

const crawlCoinDescriptionTranslateToVN = async (coin) => {
	const result = await axios(getCoinDescriptionTranslateToVN(coin?.nameId))
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					err.message +
					' crawl description coin'
			);
		});

	if (!result) {
		return;
	}
	let dataJson = {};

	try {
		const $ = cheerio.load(result);

		const arr = [];

		$('.coin-description p').each((index, el) => {
			arr.push($(el).text());
		});
		updateCoinDescriptionTranslateToVN(coin?.nameId, arr, CoinDescription);
	} catch (err) {
		console.log(err.code + ' ' + err.response?.status + ' mbbankInterest');
	}
};
module.exports = { crawlCoinDescription, crawlCoinDescriptionTranslateToVN };
