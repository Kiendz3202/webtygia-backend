const URL_HNX30 = 'https://banggia.vietstock.vn/bang-gia/hnx30';
const URL_HNX = 'https://banggia.vietstock.vn/bang-gia/hnx';
const URL_VN30 = 'https://banggia.vietstock.vn/bang-gia/vn30';
const URL_HOSE = 'https://banggia.vietstock.vn/bang-gia/hose';
const URL_UPCOM = 'https://banggia.vietstock.vn/bang-gia/upcom';

const getStockDetailAPI = (symbol) => {
	return `https://data-ifin.tvsi.com.vn/api/v1/Dashboard/GetListCompanyOverView?stockSymbol=${symbol}`;
};

const getStockChartAPI1W = (symbol, startTime, currentTime) => {
	return `https://dchart-api.vndirect.com.vn/dchart/history?resolution=15&symbol=${symbol}&from=${startTime}&to=${currentTime}`; //let currentTime = Math.floor(Date.now() / 1000);
};

const getStockChartAPI6M = (symbol, startTime, currentTime) => {
	return `https://dchart-api.vndirect.com.vn/dchart/history?resolution=60&symbol=${symbol}&from=${startTime}&to=${currentTime}`; //let currentTime = Math.floor(Date.now() / 1000);
};

const getStockChartAPIMax = (symbol, startTime, currentTime) => {
	return `https://dchart-api.vndirect.com.vn/dchart/history?resolution=D&symbol=${symbol}&from=${startTime}&to=${currentTime}`; //let currentTime = Math.floor(Date.now() / 1000);
};

const getStockDescriptionAPI = (symbol) => {
	return `https://finfo-api.vndirect.com.vn/v4/company_profiles?q=code:${symbol}`;
};

module.exports = {
	URL_HNX30,
	URL_HNX,
	URL_VN30,
	URL_HOSE,
	URL_UPCOM,
	getStockDetailAPI,
	getStockDescriptionAPI,
	getStockChartAPI1W,
	getStockChartAPI6M,
	getStockChartAPIMax,
};
