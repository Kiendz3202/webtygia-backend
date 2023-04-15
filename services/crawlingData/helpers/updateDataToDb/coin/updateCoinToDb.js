const { uploadErrorToDb } = require('../../../utils/error/uploadErrorToDb');

const updateCoinList = async (coin, model) => {
	if (coin) {
		model
			.findOneAndUpdate(
				{ nameId: coin.id },
				{
					name: coin?.name || '',
					symbol: coin?.symbol || '',
					nameId: coin?.id || '',
					image: coin?.image || '',
					priceChange1hPercent:
						coin?.price_change_percentage_1h_in_currency || '',
					priceChange24hPercent:
						coin?.price_change_percentage_24h_in_currency || '',
					priceChange7dPercent:
						coin?.price_change_percentage_7d_in_currency || '',
					priceChange14dPercent:
						coin?.price_change_percentage_14d_in_currency || '',
					priceChange30dPercent:
						coin?.price_change_percentage_30d_in_currency || '',
					priceChange200dPercent:
						coin?.price_change_percentage_200d_in_currency || '',
					priceChange1yPercent:
						coin?.price_change_percentage_1y_in_currency || '',
					volume24h: coin?.total_volume || '',
					marketCap: coin?.market_cap || '',
					currentPrice: coin?.current_price || '',
					high24h: coin?.high_24h || '',
					low24h: coin?.low_24h || '',
					ath: coin?.ath || '',
					atl: coin?.atl || '',
					fullyDilutedValuation: coin?.fully_diluted_valuation || '',
					rank: coin?.market_cap_rank || '',
					circulatingSupply: coin?.circulating_supply || '',
					totalSupply: coin?.total_supply || '',
					maxSupply: coin?.max_supply || '',
				},
				{ upsert: true }
			)
			// .then((doc) => console.log(doc?.name))
			.catch((err) => uploadErrorToDb(err.message));
	}
};

const updateCoinChart = async (coin, data, model) => {
	if (data) {
		model
			.findOneAndUpdate(
				{ nameId: coin.nameId },
				{
					symbol: coin.symbol,
					nameId: coin.nameId,
					data,
				},
				{ upsert: true }
			)
			// .then((doc) => console.log(doc?.symbol))
			.catch((err) => console.log(err.message));
	}
};

const updateCoinDescription = async (data, model) => {
	if (data) {
		model
			.findOneAndUpdate(
				{ nameId: data.nameId },
				{
					symbol: data.symbol,
					nameId: data.id,
					description: data.description.en,
					homepage: data.links.homepage[0],
					official_forum_url: data.links.official_forum_url[0],
					github: data.links.repos_url.github[0],
				},
				{ upsert: true }
			)
			// .then((doc) => console.log(doc?.symbol))
			.catch((err) => console.log(err.message));
	}
};

const updateCoinDescriptionTranslateToVN = async (
	nameId,
	description,
	model
) => {
	model
		.findOneAndUpdate(
			{ nameId: nameId },
			{
				descriptionTranslateToVN: description,
			}
		)
		// .then((doc) => console.log(doc?.symbol))
		.catch((err) => console.log(err.message));
};

const pushNewDataToCoinChart = async (coin, model, maxItemArray) => {
	if (coin) {
		model
			.findOneAndUpdate(
				{ nameId: coin.id },
				// {
				// 	$push: {
				// 		data: [Math.floor(Date.now()), coin.current_price],
				// 	},
				// }
				{
					$push: {
						data: {
							$each: [
								[Math.floor(Date.now()), coin.current_price],
							],
							$slice: -maxItemArray,
						},
					},
				}
				// { upsert: true }
			)
			// .then((doc) => console.log(doc?.symbol))
			.catch((err) => console.log(err.message));
	}
};

module.exports = {
	updateCoinList,
	updateCoinChart,
	pushNewDataToCoinChart,
	updateCoinDescription,
	updateCoinDescriptionTranslateToVN,
};
