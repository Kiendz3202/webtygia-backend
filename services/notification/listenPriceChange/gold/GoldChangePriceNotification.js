const User = require('../../../../models/user/userModel');
const { Expo } = require('expo-server-sdk');
const sendNotificationByExpo = require('../../sendNotificationByExpo/sendNotificationByExpo');
const SjcChart = require('../../../../models/gold/sjcChartModel');

const GoldChangePriceNotification = async (allTokenDevice) => {
	const goldIsSelected = await SjcChart.aggregate([
		{
			$match: {
				type: '1d',
			},
		},
		{
			// $project: {
			// 	_id: 0,
			// 	t: { $slice: ['$t', -24] },
			// 	price: { $slice: ['$price', -24] },
			// 	nameId: 1,
			// },
			$project: {
				_id: 1,
				data: { $slice: ['$buy', -2] },
				name: 1,
			},
		},
	]);

	const allUsers = await User.find();

	const messages = [];

	allUsers.map((user) => {
		user?.followGolds?.map((item) => {
			// const goldMatch = goldIsSelected.filter(
			// 	(gold) => gold._id.toString() === item.toString()
			// );
			if (item) {
				if (
					parseFloat(
						(goldIsSelected[0].data[1] -
							goldIsSelected[0].data[0]) /
							goldIsSelected[0].data[0]
					).toFixed(2) >= 0.02 ||
					parseFloat(
						(goldIsSelected[0].data[1] -
							goldIsSelected[0].data[0]) /
							goldIsSelected[0].data[0]
					).toFixed(2) <= -0.02
				) {
					messages.push({
						email: user.email,
						name: goldIsSelected[0].name,
						priceChange:
							parseFloat(
								(goldIsSelected[0].data[1] -
									goldIsSelected[0].data[0]) /
									goldIsSelected[0].data[0]
							).toFixed(2) * 100,
					});
				}
			}
		});
	});
	// console.log(messages);

	const finalMessageToSend = [];

	allTokenDevice.map((item) => {
		if (!Expo.isExpoPushToken(item?.tokenDevicePhone)) {
			console.error(
				`Push token ${item?.tokenDevicePhone} is not a valid Expo push token`
			);
		} else {
			messages.map((message) => {
				if (message?.email === item?.email) {
					finalMessageToSend.push({
						to: item?.tokenDevicePhone,
						title: `Giá vàng SJC ${
							parseFloat(message?.priceChange) > 0
								? 'đang tăng'
								: 'đang giảm'
						}, kiểm tra ngay`,
						body: `Giá vàng SJC đã ${
							parseFloat(message?.priceChange) > 0
								? 'tăng lên'
								: 'giảm xuống'
						} ${parseFloat(
							message?.priceChange > 0
								? message?.priceChange
								: -message?.priceChange
						).toFixed(
							2
						)}% trong 1 giờ qua. Giá vàng mua vào hiện tại là ${goldIsSelected[0]?.data[1]?.toLocaleString()}VND`,
						data: {
							type: 'gold',
							name: message?.name,
							...message,
						},
					});
				}
			});
		}
	});
	sendNotificationByExpo(finalMessageToSend);
};

module.exports = { GoldChangePriceNotification };
