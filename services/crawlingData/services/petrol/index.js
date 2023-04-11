const { crawlPetrolimex, crawlPetrolimexChart } = require('./crawlPetrolimex');
const cheerio = require('cheerio');
const axios = require('axios');
const PetrolimexChart = require('../../../../models/petrol/petrolimexChartModel');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const { delay } = require('../../utils/promise/delay');
const { URL_PETROLIMEX } = require('../../configs/constants/petrol');

const petrolRunAll = async () => {
	crawlPetrolimex();
};

const upsertAllChartPetrolimex = async () => {
	crawlPetrolimexChart();
};

const updatePetrolimexChart1y = async () => {
	const result = await axios(URL_PETROLIMEX)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					' updatepetrolimexchart1year'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Petrolimex';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now());

		dataJson.ron95III_1 =
			$('#myTabletoday tbody :nth-child(4) td:nth-child(2)')
				.text()
				.slice(1, -1) * 1000;
	} catch (err) {
		console.log(err);
	}

	PetrolimexChart.findOneAndUpdate(
		{ type: '1y' },
		{
			name: dataJson?.name,
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -365,
				},
				price: {
					$each: [dataJson?.ron95III_1],
					$slice: -365,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update Petrolimexchart1d'
		)
	);
};

const updatePetrolimexChartMax = async () => {
	const result = await axios(URL_PETROLIMEX)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					' updatepetrolimexchartmax'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Petrolimex';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now());

		dataJson.ron95III_1 = $(
			'#myTabletoday tbody :nth-child(4) td:nth-child(2)'
		)
			.text()
			.slice(1, -1);
	} catch (err) {
		console.log(err);
	}

	PetrolimexChart.findOneAndUpdate(
		{ type: 'max' },
		{
			name: dataJson?.name,
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -1000,
				},
				price: {
					$each: [dataJson?.ron95III_1],
					$slice: -1000,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update Petrolimexchart1d'
		)
	);
};

module.exports = {
	petrolRunAll,
	upsertAllChartPetrolimex,
	updatePetrolimexChart1y,
	updatePetrolimexChartMax,
};
