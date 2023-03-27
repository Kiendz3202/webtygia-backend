const getCoinListAPI = (per_page, page) => {
	return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y`;
};

const getCoinChartAPI = (nameId) => {
	return `https://api.coingecko.com/api/v3/coins/${nameId}/market_chart?vs_currency=usd&days=90`;
};

const getCoinDescription = (nameId) => {
	return `https://api.coingecko.com/api/v3/coins/${nameId}`;
};

const getCoinDescriptionTranslateToVN = (nameId) => {
	return `https://www.coingecko.com/vi/ty_gia/${nameId}`;
};

const getCoinChartAPI1D = (nameId) => {
	return `https://api.coingecko.com/api/v3/coins/${nameId}/market_chart?vs_currency=usd&days=1`;
};

const getCoinChartAPI90D = (nameId) => {
	return `https://api.coingecko.com/api/v3/coins/${nameId}/market_chart?vs_currency=usd&days=90`;
};

const getCoinChartAPIMax = (nameId) => {
	return `https://api.coingecko.com/api/v3/coins/${nameId}/market_chart?vs_currency=usd&days=max`;
};

module.exports = {
	getCoinListAPI,
	getCoinChartAPI,
	getCoinDescription,
	getCoinDescriptionTranslateToVN,
	getCoinChartAPI1D,
	getCoinChartAPI90D,
	getCoinChartAPIMax,
};
