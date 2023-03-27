const pageEvaluateFunc = async () => {
	let stocks = [];
	let stockElements = document.querySelectorAll(
		'#price-board-container tbody tr'
	);

	stockElements.forEach((stock) => {
		let dataJson = {};

		try {
			dataJson.name =
				stock.getElementsByTagName('td')[0]?.dataset.tooltip;
			let symbolCrawl = stock.getElementsByTagName('span')[0].innerText;
			if (symbolCrawl.includes('*')) {
				let len = symbolCrawl?.length;
				if (symbolCrawl.includes('**')) {
					dataJson.symbol = symbolCrawl.slice(0, len - 2);
				} else {
					dataJson.symbol = symbolCrawl.slice(0, len - 1);
				}
			} else {
				dataJson.symbol = symbolCrawl;
			}

			dataJson.timeUpdate = Math.floor(Date.now() / 1000);

			dataJson.reference = stock.getElementsByClassName(
				'cell-body-highlight'
			)[0]?.innerText;
			dataJson.ceil = stock.getElementsByClassName(
				'cell-body-highlight'
			)[1]?.innerText;
			dataJson.floor = stock.getElementsByClassName(
				'cell-body-highlight'
			)[2]?.innerText;

			dataJson.currentPrice = stock.getElementsByClassName(
				'cell-body-highlight'
			)[3]?.innerText;

			dataJson.high = stock.getElementsByClassName(
				'cell-body-highlight'
			)[7]?.innerText;
			dataJson.low = stock.getElementsByClassName(
				'cell-body-highlight'
			)[8]?.innerText;

			dataJson.change = stock.getElementsByClassName(
				'cell-body-highlight'
			)[5]?.innerText;
			dataJson.changePercent = stock.getElementsByClassName(
				'cell-body-highlight'
			)[6]?.innerText;

			const turnOverElement = stock.getElementsByTagName('td')[20];
			dataJson.turnOver =
				turnOverElement.getElementsByTagName('span')[0]?.innerText;
		} catch (err) {
			console.log(err);
		}

		stocks.push(dataJson);
	});

	return stocks;
};

module.exports = { pageEvaluateFunc };
