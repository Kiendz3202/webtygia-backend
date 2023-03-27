const StockDescription = require('../../../../models/stock/stockDescription/stockDescriptionModel');
const axios = require('axios');
const cron = require('node-cron');
const { delay } = require('../../utils/promise/delay');
const { getStockDescriptionAPI } = require('../../configs/constants/stock');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const {
	updateStockDescription,
} = require('../../helpers/updateDataToDb/stocks/updateStockToDb');

const crawlStockDescription = async (symbol) => {
	axios
		.get(getStockDescriptionAPI(symbol))
		.then((response) => {
			const data = response.data.data[0];

			updateStockDescription(data, StockDescription);
		})
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					err.message +
					' crawl stock description'
			);
		});
};
module.exports = { crawlStockDescription };
