const cheerio = require('cheerio');
const axios = require('axios');
const Petrolimex = require('../../../../models/petrol/petrolimexModel');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const { delay } = require('../../utils/promise/delay');
const { URL_PETROLIMEX } = require('../../configs/constants/petrol');
const {
	updatePetrolimex,
} = require('../../helpers/updateDataToDb/petrol/updatePetrolToDb');
const PetrolimexChart = require('../../../../models/petrol/petrolimexChartModel');

const crawlPetrolimex = async () => {
	const result = await axios(URL_PETROLIMEX)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' petrolimex'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Petrolimex';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now());

		dataJson.ron95v_1 = $(
			'#myTabletoday tbody :nth-child(7) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
		dataJson.ron95v_2 = $(
			'#myTabletoday tbody :nth-child(7) td:nth-child(3)'
		)
			.text()
			.slice(1, -1);

		dataJson.ron95III_1 = $(
			'#myTabletoday tbody :nth-child(4) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
		dataJson.ron95III_2 = $(
			'#myTabletoday tbody :nth-child(4) td:nth-child(3)'
		)
			.text()
			.slice(1, -1);

		dataJson.ron92II_1 = $(
			'#myTabletoday tbody :nth-child(1) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
		dataJson.ron92II_2 = $(
			'#myTabletoday tbody :nth-child(1) td:nth-child(3)'
		)
			.text()
			.slice(1, -1);

		dataJson.do0001SV_1 = $(
			'#myTabletoday tbody :nth-child(2) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
		dataJson.do0001SV_2 = $(
			'#myTabletoday tbody :nth-child(2) td:nth-child(3)'
		)
			.text()
			.slice(1, -1);

		dataJson.do005SII_1 = $(
			'#myTabletoday tbody :nth-child(3) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
		dataJson.do005SII_2 = $(
			'#myTabletoday tbody :nth-child(3) td:nth-child(3)'
		)
			.text()
			.slice(1, -1);

		dataJson.dauhoa_1 = $(
			'#myTabletoday tbody :nth-child(5) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
		dataJson.dauhoa_2 = $(
			'#myTabletoday tbody :nth-child(5) td:nth-child(3)'
		)
			.text()
			.slice(1, -1);
	} catch (err) {
		console.log(err);
	}

	await updatePetrolimex(dataJson, Petrolimex);

	PetrolimexChart.findOneAndUpdate(
		{ type: '1d' },
		{
			name: dataJson?.name,
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -48,
				},
				price: {
					$each: [dataJson?.ron95III_1],
					$slice: -48,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update Petrolimexchart1d'
		)
	);
};

const crawlPetrolimexChart = async () => {
	const arr1year = [
		{ c: 24360.0, t: '2022-01-24T00:00:00' },
		{ c: 24360.0, t: '2022-01-31T00:00:00' },
		{ c: 25320.0, t: '2022-02-07T00:00:00' },
		{ c: 25320.0, t: '2022-02-14T00:00:00' },
		{ c: 26280.0, t: '2022-02-21T00:00:00' },
		{ c: 26830.0, t: '2022-02-28T00:00:00' },
		{ c: 29820.0, t: '2022-03-07T00:00:00' },
		{ c: 29820.0, t: '2022-03-14T00:00:00' },
		{ c: 29190.0, t: '2022-03-21T00:00:00' },
		{ c: 28150.0, t: '2022-03-28T00:00:00' },
		{ c: 28150.0, t: '2022-04-04T00:00:00' },
		{ c: 27310.0, t: '2022-04-11T00:00:00' },
		{ c: 27990.0, t: '2022-04-18T00:00:00' },
		{ c: 27990.0, t: '2022-04-25T00:00:00' },
		{ c: 28430.0, t: '2022-05-02T00:00:00' },
		{ c: 29980.0, t: '2022-05-09T00:00:00' },
		{ c: 29980.0, t: '2022-05-16T00:00:00' },
		{ c: 30650.0, t: '2022-05-23T00:00:00' },
		{ c: 31570.0, t: '2022-05-30T00:00:00' },
		{ c: 31570.0, t: '2022-06-06T00:00:00' },
		{ c: 32370.0, t: '2022-06-13T00:00:00' },
		{ c: 32870.0, t: '2022-06-20T00:00:00' },
		{ c: 32760.0, t: '2022-06-27T00:00:00' },
		{ c: 29670.0, t: '2022-07-04T00:00:00' },
		{ c: 29670.0, t: '2022-07-11T00:00:00' },
		{ c: 26070.0, t: '2022-07-18T00:00:00' },
		{ c: 26070.0, t: '2022-07-25T00:00:00' },
		{ c: 25600.0, t: '2022-08-01T00:00:00' },
		{ c: 24660.0, t: '2022-08-08T00:00:00' },
		{ c: 24660.0, t: '2022-08-15T00:00:00' },
		{ c: 24660.0, t: '2022-08-22T00:00:00' },
		{ c: 24660.0, t: '2022-08-29T00:00:00' },
		{ c: 24230.0, t: '2022-09-05T00:00:00' },
		{ c: 23210.0, t: '2022-09-12T00:00:00' },
		{ c: 22580.0, t: '2022-09-19T00:00:00' },
		{ c: 22580.0, t: '2022-09-26T00:00:00' },
		{ c: 21440.0, t: '2022-10-03T00:00:00' },
		{ c: 22000.0, t: '2022-10-10T00:00:00' },
		{ c: 22340.0, t: '2022-10-17T00:00:00' },
		{ c: 22340.0, t: '2022-10-24T00:00:00' },
		{ c: 22750.0, t: '2022-10-31T00:00:00' },
		{ c: 23860.0, t: '2022-11-07T00:00:00' },
		{ c: 23860.0, t: '2022-11-14T00:00:00' },
		{ c: 23780.0, t: '2022-11-21T00:00:00' },
		{ c: 22700.0, t: '2022-11-28T00:00:00' },
		{ c: 22700.0, t: '2022-12-05T00:00:00' },
		{ c: 21200.0, t: '2022-12-12T00:00:00' },
		{ c: 20700.0, t: '2022-12-19T00:00:00' },
		{ c: 21800.0, t: '2022-12-26T00:00:00' },
		{ c: 22150.0, t: '2023-01-02T00:00:00' },
		{ c: 22150.0, t: '2023-01-09T00:00:00' },
		{ c: 22150.0, t: '2023-01-16T00:00:00' },
		{ c: 22150.0, t: '2023-01-23T00:00:00' },

		{ c: 23140.0, t: '2023-01-30T00:00:00' },
		{ c: 23140.0, t: '2023-02-06T00:00:00' },
		{ c: 23760.0, t: '2023-02-13T00:00:00' },
		{ c: 23440.0, t: '2023-02-20T00:00:00' },
		{ c: 23320.0, t: '2023-02-27T00:00:00' },
		{ c: 23320.0, t: '2023-03-06T00:00:00' },
		{ c: 23810.0, t: '2023-03-13T00:00:00' },
		{ c: 23030.0, t: '2023-03-20T00:00:00' },
		{ c: 23030.0, t: '2023-03-27T00:00:00' },
		{ c: 23120.0, t: '2023-04-03T00:00:00' },
	];
	const arrMax = [
		{ c: 18790.0, t: '2017-01-01T00:00:00' },
		{ c: 18280.0, t: '2017-03-01T00:00:00' },
		{ c: 17200.0, t: '2017-05-01T00:00:00' },
		{ c: 18180.0, t: '2017-07-01T00:00:00' },
		{ c: 18570.0, t: '2017-09-01T00:00:00' },
		{ c: 19280.0, t: '2017-11-01T00:00:00' },
		{ c: 19980.0, t: '2018-01-01T00:00:00' },
		{ c: 20500.0, t: '2018-03-01T00:00:00' },
		{ c: 21170.0, t: '2018-05-01T00:00:00' },
		{ c: 21170.0, t: '2018-07-01T00:00:00' },
		{ c: 22200.0, t: '2018-09-01T00:00:00' },
		{ c: 18140.0, t: '2018-11-01T00:00:00' },
		{ c: 17600.0, t: '2019-01-01T00:00:00' },
		{ c: 21230.0, t: '2019-03-01T00:00:00' },
		{ c: 20130.0, t: '2019-05-01T00:00:00' },
		{ c: 20400.0, t: '2019-07-01T00:00:00' },
		{ c: 20440.0, t: '2019-09-01T00:00:00' },
		{ c: 20990.0, t: '2019-11-01T00:00:00' },
		{ c: 19120.0, t: '2020-01-01T00:00:00' },
		{ c: 11630.0, t: '2020-03-01T00:00:00' },
		{ c: 14970.0, t: '2020-05-01T00:00:00' },
		{ c: 15110.0, t: '2020-07-01T00:00:00' },
		{ c: 14940.0, t: '2020-09-01T00:00:00' },
		{ c: 16470.0, t: '2020-11-01T00:00:00' },
		{ c: 18080.0, t: '2021-01-01T00:00:00' },
		{ c: 19160.0, t: '2021-03-01T00:00:00' },
		{ c: 20910.0, t: '2021-05-01T00:00:00' },
		{ c: 21130.0, t: '2021-07-01T00:00:00' },
		{ c: 24330.0, t: '2021-09-01T00:00:00' },
		{ c: 23290.0, t: '2021-11-01T00:00:00' },
		{ c: 26280.0, t: '2022-01-01T00:00:00' },
		{ c: 27990.0, t: '2022-03-01T00:00:00' },
		{ c: 32870.0, t: '2022-05-01T00:00:00' },
		{ c: 24660.0, t: '2022-07-01T00:00:00' },
		{ c: 22340.0, t: '2022-09-01T00:00:00' },
		{ c: 20700.0, t: '2022-11-01T00:00:00' },
		{ c: 22150.0, t: '2023-01-01T00:00:00' },
		{ c: 23120.0, t: '2023-03-01T00:00:00' },
	];
	let price1year = [];
	let time1year = [];

	let priceMax = [];
	let timeMax = [];

	for (let item of arr1year) {
		const date = new Date(item.t);
		const timestamp = Math.floor(date.getTime());

		price1year.push(item.c);
		time1year.push(timestamp);
	}

	for (let item of arrMax) {
		const date = new Date(item.t);
		const timestamp = Math.floor(date.getTime());

		priceMax.push(item.c);
		timeMax.push(timestamp);
	}

	PetrolimexChart.findOneAndUpdate(
		{ type: '1d' },
		{
			name: 'Petrolimex',
			t: [],
			price: [],
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update Petrolimexchart1d'
		)
	);

	PetrolimexChart.findOneAndUpdate(
		{ type: '1y' },
		{
			name: 'Petrolimex',
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
				' update Petrolimexchart1year'
		)
	);

	PetrolimexChart.findOneAndUpdate(
		{ type: 'max' },
		{
			name: 'Petrolimex',
			price: priceMax,
			t: timeMax,
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update PetrolimexchartMax'
		)
	);
};
module.exports = { crawlPetrolimex, crawlPetrolimexChart };
