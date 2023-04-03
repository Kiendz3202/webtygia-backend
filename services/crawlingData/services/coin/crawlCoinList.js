const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const { delay } = require('../../utils/promise/delay');
const { getCoinListAPI } = require('../../configs/constants/coin');

const Coin = require('../../../../models/coin/coinModel');
const {
	updateCoinList,
} = require('../../helpers/updateDataToDb/coin/updateCoinToDb');

const crawlCoinList = async (per_page, page) => {
	const data = await axios
		.get(getCoinListAPI(per_page, page))
		.then((response) => {
			// response.data.map(async (coin) => {
			// 	//push symbol to arrCoinNew
			// 	// arrCoinNew.push(coin.symbol);
			// 	//update
			// 	updateCoinList(coin, Coin);
			// });

			for (const coin of response.data) {
				updateCoinList(coin, Coin);
			}
			return response.data;
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
	return data;
};
module.exports = { crawlCoinList };
