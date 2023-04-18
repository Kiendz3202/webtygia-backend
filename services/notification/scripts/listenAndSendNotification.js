const {
	startListeningAndSendNotificationCoin,
} = require('../listenPriceChange/coin/index');
const {
	startListeningAndSendNotificationStock,
} = require('../listenPriceChange/stock/index');
const {
	startListeningAndSendNotificationGold,
} = require('../listenPriceChange/gold/index');
const {
	startListeningAndSendNotificationUsd,
} = require('../listenPriceChange/usd/index');
const {
	startListeningAndSendNotificationPetrol,
} = require('../listenPriceChange/petrol/index');
const cron = require('node-cron');
const { delay } = require('../../crawlingData/utils/promise/delay');
const TokenDevicePhone = require('../../../models/token/tokenDevicePhone');

// const allTokenDevice = [
// 	{
// 		tokenDevicePhone: 'ExponentPushToken[X9r9VZJ5t-uLJP3ZTLzUXO]',
// 		email: 'manhkien3202@gmail.com',
// 	},
// 	{
// 		tokenDevicePhone: 'ExponentPushToken[J-oJM5PL2IQmH5lEdQPWUM]',
// 		email: 'manhkientest3202@gmail.com',
// 	},
// 	// {
// 	// 	tokenDevicePhone: 'ExponentPushToken[J-oJM5PL2IQmH5lEdKDFSB]',
// 	// 	email: 'kiennguyenmanh3202@gmail.com',
// 	// },
// ];

module.exports = async function () {
	cron.schedule('*/5 * * * *', async () => {
		const allTokenDevice = await TokenDevicePhone.find({}).catch((err) =>
			console.log(err)
		);

		startListeningAndSendNotificationCoin(allTokenDevice);
	});
	cron.schedule('*/15 * * * *', async () => {
		const allTokenDevice = await TokenDevicePhone.find({}).catch((err) =>
			console.log(err)
		);
		startListeningAndSendNotificationStock(allTokenDevice);
	});
	cron.schedule('*/30 * * * *', async () => {
		const allTokenDevice = await TokenDevicePhone.find({}).catch((err) =>
			console.log(err)
		);
		startListeningAndSendNotificationGold(allTokenDevice);
		await delay(5000);
		startListeningAndSendNotificationUsd(allTokenDevice);
		await delay(5000);
		startListeningAndSendNotificationPetrol(allTokenDevice);
	});

	// });
};
