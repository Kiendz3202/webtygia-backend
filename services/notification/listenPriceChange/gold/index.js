const {
	GoldChangePriceNotification,
} = require('./GoldChangePriceNotification');

// const allTokenDevice = await TokenDevicePhone.find() chưa import TokenDevicePhone
// const allTokenDevice = [
// 	{
// 		tokenDevicePhone: 'ExponentPushToken[J-oJM5PL2IQmH5lEdFTDJU]',
// 		email: 'manhkien3202@gmail.com',
// 	},
// 	{
// 		tokenDevicePhone: 'ExponentPushToken[J-oJM5PL2IQmH5lEdSIBDU]',
// 		email: 'manhkientest3202@gmail.com',
// 	},
// 	{
// 		tokenDevicePhone: 'ExponentPushToken[J-oJM5PL2IQmH5lEdKDFSB]',
// 		email: 'kiennguyenmanh3202@gmail.com',
// 	},
// ];

const startListeningAndSendNotificationGold = async (allTokenDevice) => {
	GoldChangePriceNotification(allTokenDevice);
};

module.exports = { startListeningAndSendNotificationGold };
