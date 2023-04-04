const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');

const {
	crawlDataByPuppeteer,
} = require('../../helpers/puppeteer/crawlDataByPuppeteer');
const { delay } = require('../../utils/promise/delay');
const {
	URL_EXCHANGE_RATE_VIETCOMBANK,
} = require('../../configs/constants/exchangeRate');
const UsdInManyBanks = require('../../../../models/foreignCurrency/usdInManyBanksModel');
const UsdVietombankChart = require('../../../../models/foreignCurrency/usdVietcombankChart');

const crawlForeignCurrency = async (url) => {
	const pageEvaluateFunc = async () => {
		let arr = [];

		let usdElements = document.querySelectorAll('#bang_gia tbody tr');
		// console.log(usdElements);

		usdElements.forEach((item) => {
			let dataJson = {};

			try {
				dataJson.name = item.querySelector(
					':nth-child(1) a :nth-child(2)'
				).innerText;

				dataJson.buyCast =
					item.querySelector('td:nth-child(2)').innerText;
				dataJson.buyTransfer =
					item.querySelector('td:nth-child(3)').innerText;
				dataJson.sellCast =
					item.querySelector('td:nth-child(4)').innerText;
				dataJson.sellTransfer =
					item.querySelector('td:nth-child(5)').innerText;
			} catch (err) {
				console.log(err);
			}

			arr.push(dataJson);
		});

		return arr;
	};

	let data = false;
	let attemps = 0;
	//retry request until it gets data or tries 3 times
	while (data == false && attemps < 2) {
		data = await crawlDataByPuppeteer(
			// URL_EXCHANGE_RATE_VIETCOMBANK,
			url,
			pageEvaluateFunc
		);
		// console.log(data.length);
		attemps++;
		// console.log(data);
		if (data) {
			const timeUpdate = Math.floor(Date.now() / 1000);

			UsdInManyBanks.findOneAndUpdate(
				{ symbol: 'USD' },
				{
					symbol: 'USD',
					timeUpdate: timeUpdate,
					data: data,
				},
				{ upsert: true }
			)
				// .then((doc) => console.log(doc))
				.catch((err) => {
					uploadErrorToDb(
						err.code +
							' ' +
							err.response?.status +
							' usd in many banks'
					);
				});
			// console.log(data);
		}

		if (data === false) {
			//wait a few second, also a good idea to swap proxy here
			console.log('Recrawl........' + attemps);
			await delay(3000);
		}
	}
};

const crawlUsdVietcombankChart = async () => {
	const arr1year = [
		{ c: 22620.0, t: '2022-01-17T00:00:00' },
		{ c: 22640.0, t: '2022-01-24T00:00:00' },
		{ c: 22690.0, t: '2022-02-07T00:00:00' },
		{ c: 22840.0, t: '2022-02-14T00:00:00' },
		{ c: 22820.0, t: '2022-02-21T00:00:00' },
		{ c: 22840.0, t: '2022-02-28T00:00:00' },
		{ c: 22870.0, t: '2022-03-07T00:00:00' },
		{ c: 22860.0, t: '2022-03-14T00:00:00' },
		{ c: 22870.0, t: '2022-03-21T00:00:00' },
		{ c: 22840.0, t: '2022-03-28T00:00:00' },
		{ c: 22860.0, t: '2022-04-04T00:00:00' },
		{ c: 22900.0, t: '2022-04-11T00:00:00' },
		{ c: 22970.0, t: '2022-04-18T00:00:00' },
		{ c: 22955.0, t: '2022-04-25T00:00:00' },
		{ c: 22950.0, t: '2022-05-02T00:00:00' },
		{ c: 23090.0, t: '2022-05-09T00:00:00' },
		{ c: 23170.0, t: '2022-05-16T00:00:00' },
		{ c: 23200.0, t: '2022-05-23T00:00:00' },
		{ c: 23200.0, t: '2022-05-30T00:00:00' },
		{ c: 23170.0, t: '2022-06-06T00:00:00' },
		{ c: 23240.0, t: '2022-06-13T00:00:00' },
		{ c: 23250.0, t: '2022-06-20T00:00:00' },
		{ c: 23300.0, t: '2022-06-27T00:00:00' },
		{ c: 23360.0, t: '2022-07-04T00:00:00' },
		{ c: 23440.0, t: '2022-07-11T00:00:00' },
		{ c: 23410.0, t: '2022-07-18T00:00:00' },
		{ c: 23340.0, t: '2022-07-25T00:00:00' },
		{ c: 23390.0, t: '2022-08-01T00:00:00' },
		{ c: 23390.0, t: '2022-08-08T00:00:00' },
		{ c: 23405.0, t: '2022-08-15T00:00:00' },
		{ c: 23430.0, t: '2022-08-22T00:00:00' },
		{ c: 23460.0, t: '2022-08-29T00:00:00' },
		{ c: 23550.0, t: '2022-09-05T00:00:00' },
		{ c: 23655.0, t: '2022-09-12T00:00:00' },
		{ c: 23705.0, t: '2022-09-19T00:00:00' },
		{ c: 23870.0, t: '2022-09-26T00:00:00' },
		{ c: 23880.0, t: '2022-10-03T00:00:00' },
		{ c: 24090.0, t: '2022-10-10T00:00:00' },
		{ c: 24730.0, t: '2022-10-17T00:00:00' },
		{ c: 24737.0, t: '2022-10-24T00:00:00' },
		{ c: 24737.0, t: '2022-10-31T00:00:00' },
		{ c: 24760.0, t: '2022-11-07T00:00:00' },
		{ c: 24733.0, t: '2022-11-14T00:00:00' },
		{ c: 24720.0, t: '2022-11-21T00:00:00' },
		{ c: 24100.0, t: '2022-11-28T00:00:00' },
		{ c: 23560.0, t: '2022-12-05T00:00:00' },
		{ c: 23580.0, t: '2022-12-12T00:00:00' },
		{ c: 23590.0, t: '2022-12-19T00:00:00' },
		{ c: 23570.0, t: '2022-12-26T00:00:00' },
		{ c: 23470.0, t: '2023-01-02T00:00:00' },
		{ c: 23450.0, t: '2023-01-09T00:00:00' },
		{ c: 23460.0, t: '2023-01-16T00:00:00' },
	];
	const arrMax = [
		{ c: 16061.0, t: '2006-09-01T00:00:00' },
		{ c: 16048.0, t: '2007-01-01T00:00:00' },
		{ c: 16241.0, t: '2007-05-01T00:00:00' },
		{ c: 16030.0, t: '2007-09-01T00:00:00' },
		{ c: 16127.0, t: '2008-01-01T00:00:00' },
		{ c: 16600.0, t: '2008-05-01T00:00:00' },
		{ c: 17486.0, t: '2008-09-01T00:00:00' },
		{ c: 17784.0, t: '2009-01-01T00:00:00' },
		{ c: 17823.0, t: '2009-05-01T00:00:00' },
		{ c: 18479.0, t: '2009-09-01T00:00:00' },
		{ c: 19000.0, t: '2010-01-01T00:00:00' },
		{ c: 19500.0, t: '2010-05-01T00:00:00' },
		{ c: 19500.0, t: '2010-09-01T00:00:00' },
		{ c: 20720.0, t: '2011-01-01T00:00:00' },
		{ c: 20834.0, t: '2011-05-01T00:00:00' },
		{ c: 21036.0, t: '2011-09-01T00:00:00' },
		{ c: 20930.0, t: '2012-01-01T00:00:00' },
		{ c: 20880.0, t: '2012-05-01T00:00:00' },
		{ c: 20855.0, t: '2012-09-01T00:00:00' },
		{ c: 20960.0, t: '2013-01-01T00:00:00' },
		{ c: 21180.0, t: '2013-05-01T00:00:00' },
		{ c: 21125.0, t: '2013-09-01T00:00:00' },
		{ c: 21105.0, t: '2014-01-01T00:00:00' },
		{ c: 21220.0, t: '2014-05-01T00:00:00' },
		{ c: 21405.0, t: '2014-09-01T00:00:00' },
		{ c: 21630.0, t: '2015-01-01T00:00:00' },
		{ c: 22505.0, t: '2015-05-01T00:00:00' },
		{ c: 22540.0, t: '2015-09-01T00:00:00' },
		{ c: 22320.0, t: '2016-01-01T00:00:00' },
		{ c: 22335.0, t: '2016-05-01T00:00:00' },
		{ c: 22790.0, t: '2016-09-01T00:00:00' },
		{ c: 22765.0, t: '2017-01-01T00:00:00' },
		{ c: 22765.0, t: '2017-05-01T00:00:00' },
		{ c: 22735.0, t: '2017-09-01T00:00:00' },
		{ c: 22800.0, t: '2018-01-01T00:00:00' },
		{ c: 23340.0, t: '2018-05-01T00:00:00' },
		{ c: 23200.0, t: '2018-09-01T00:00:00' },
		{ c: 23280.0, t: '2019-01-01T00:00:00' },
		{ c: 23190.0, t: '2019-05-01T00:00:00' },
		{ c: 23170.0, t: '2019-09-01T00:00:00' },
		{ c: 23420.0, t: '2020-01-01T00:00:00' },
		{ c: 23180.0, t: '2020-05-01T00:00:00' },
		{ c: 23125.0, t: '2020-09-01T00:00:00' },
		{ c: 23050.0, t: '2021-01-01T00:00:00' },
		{ c: 22770.0, t: '2021-05-01T00:00:00' },
		{ c: 22780.0, t: '2021-09-01T00:00:00' },
		{ c: 22955.0, t: '2022-01-01T00:00:00' },
		{ c: 23460.0, t: '2022-05-01T00:00:00' },
		{ c: 23570.0, t: '2022-09-01T00:00:00' },
		{ c: 23460.0, t: '2023-01-01T00:00:00' },
	];
	let price1year = [];
	let time1year = [];

	let priceMax = [];
	let timeMax = [];

	for (let item of arr1year) {
		const date = new Date(item.t);
		const timestamp = Math.floor(date.getTime() / 1000);

		price1year.push(item.c);
		time1year.push(timestamp);
	}

	for (let item of arrMax) {
		const date = new Date(item.t);
		const timestamp = Math.floor(date.getTime() / 1000);

		priceMax.push(item.c);
		timeMax.push(timestamp);
	}

	UsdVietombankChart.findOneAndUpdate(
		{ name: '1d' },
		{
			symbol: 'Vietcombank',
			t: [],
			price: [],
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code +
				' ' +
				err.response?.status +
				' update usdvietcombankchart1d'
		)
	);

	UsdVietombankChart.findOneAndUpdate(
		{ name: '1y' },
		{
			symbol: 'Vietcombank',
			price: price1year,
			t: time1year,
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code +
				' ' +
				err.response?.status +
				' update usdvietcombankchart1year'
		)
	);

	UsdVietombankChart.findOneAndUpdate(
		{ name: 'max' },
		{
			symbol: 'Vietcombank',
			price: priceMax,
			t: timeMax,
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code +
				' ' +
				err.response?.status +
				' update usdvietcombankchartMax'
		)
	);
};

module.exports = { crawlForeignCurrency, crawlUsdVietcombankChart };
