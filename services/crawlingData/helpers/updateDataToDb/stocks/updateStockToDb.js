const { uploadErrorToDb } = require('../../../utils/error/uploadErrorToDb');

const updateStockList = async (stock, model) => {
	model
		.findOneAndUpdate(
			{ symbol: stock.symbol },
			{
				name: stock.name,
				symbol: stock.symbol,
				timeUpdate: stock.timeUpdate,
				reference: stock.reference,
				ceil: stock.ceil,
				floor: stock.floor,
				currentPrice: stock.currentPrice,
				high: stock.high,
				low: stock.low,
				change: stock.change,
				changePercent: stock.changePercent,
				turnOver: stock.turnOver,
			},
			{ upsert: true }
		)
		// .then((doc) => console.log(doc?.symbol))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + stock.symbol
			);
		});
};

const updateStockDetail = async (stock, model) => {
	model
		.findOneAndUpdate(
			{ symbol: stock.symbol },
			{
				name: stock.name,
				symbol: stock.symbol,
				timeUpdate: stock.timeUpdate,
				reference: stock.reference,
				ceil: stock.ceil,
				floor: stock.floor,
				currentPrice: stock.currentPrice,
				change: stock.change,
				changePercent: stock.changePercent.slice(0, -1),
				openPrice: stock.openPrice,
				high: stock.high,
				low: stock.low,
				turnOver: stock.turnOver,
				marketcap: stock.marketcap,

				priceChange52Week: stock.priceChange52Week,
				averageVolume10Day: stock.averageVolume10Day,

				percentPriceChange1Week: stock.percentPriceChange1Week,
				percentPriceChange1Month: stock.percentPriceChange1Month,
				percentPriceChange3Month: stock.percentPriceChange3Month,
				percentPriceChange6Month: stock.percentPriceChange6Month,
				percentPriceChange1Year: stock.percentPriceChange1Year,

				priceChange1Week: stock.priceChange1Week,
				priceChange1Month: stock.priceChange1Month,
				priceChange3Month: stock.priceChange3Month,
				priceChange6Month: stock.priceChange6Month,
				priceChange1Year: stock.priceChange1Year,

				high52Week: stock.high52Week,
				low52Week: stock.low52Week,
				outstandingShare: stock.outstandingShare,
				freeFloat: stock.freeFloat,
				pe: stock.pe,
				dilutionPE: stock.dilutionPE,
				pb: stock.pb,
				eps: stock.eps,
				dilutionEPS: stock.dilutionEPS,
				bookValue: stock.bookValue,
				lastInterest: stock.lastInterest,
				roe: stock.roe,
				companyInfo: stock.symbol,
			},
			{ upsert: true }
		)
		// .then((doc) => console.log(doc?.symbol))
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					' stockdetail ' +
					stock.symbol
			);
		});
};

const updateStockChart = async (stock, data, model) => {
	model
		.findOneAndUpdate(
			{ symbol: stock.symbol },
			{
				symbol: stock.symbol,
				t: data.t,
				price: data.o,
			},
			{ upsert: true }
		)
		// .then((doc) => console.log(stock.symbol + ' chart HNX'))
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					' stockchart ' +
					stock.symbol
			);
		});
};

const pushNewDataToStockChart = async (stock, model, maxItemArray) => {
	model
		.findOneAndUpdate(
			{ symbol: stock.symbol },
			// {
			// 	symbol: stock.symbol,
			// 	$push: {
			// 		t: stock.timeUpdate,
			// 		price: stock.currentPrice || stock.reference,
			// 	},
			// }
			{
				symbol: stock.symbol,
				$push: {
					t: {
						$each: [stock.timeUpdate],
						$slice: -maxItemArray,
					},
					price: {
						$each: [stock.currentPrice || stock.reference],
						$slice: -maxItemArray,
					},
				},
			}
			// { upsert: true }
		)
		// .then((doc) => console.log(doc?.symbol))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + stock.symbol
			);
		});
};

const updateStockDescription = async (data, model) => {
	model
		.findOneAndUpdate(
			{ symbol: data.code },
			{
				symbol: data.code,
				image: data.logo,
				vnName: data.vnName,
				enName: data.enName,
				foundDate: data.foundDate,
				taxCode: data.taxCode,
				registrationCode: data.registrationCode,
				address: data.vnAddress,
				phone: data.phone,
				fax: data.fax,
				website: data.website,
				email: data.email,
				employees: data.employees,
				description: data.vnSummary,
			},
			{ upsert: true }
		)
		// .then((doc) => console.log(doc?.symbol))
		.catch((err) => console.log(err.message));
};

module.exports = {
	updateStockList,
	updateStockDetail,
	updateStockChart,
	pushNewDataToStockChart,
	updateStockDescription,
};
