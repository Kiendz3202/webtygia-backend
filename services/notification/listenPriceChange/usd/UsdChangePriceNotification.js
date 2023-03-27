const User = require('../../../../models/user/userModel');
const { Expo } = require('expo-server-sdk');
const sendNotificationByExpo = require('../../sendNotificationByExpo/sendNotificationByExpo');
const UsdVietcombankChart = require('../../../../models/foreignCurrency/usdVietcombankChart');

const UsdChangePriceNotification = async (allTokenDevice) => {
	const usdIsSelected = await UsdVietcombankChart.aggregate([
		{
			$match: {
				name: '1d',
			},
		},
		{
			$project: {
				_id: 1,
				data: { $slice: ['$price', -2] },
			},
		},
	]);

	const allUsers = await User.find();

	const messages = [];

	allUsers.map((user) => {
		user?.followForeignCurrency?.map((item) => {
			// const goldMatch = usdIsSelected.filter(
			// 	(gold) => gold._id.toString() === item.toString()
			// );
			if (item) {
				if (
					parseFloat(
						(usdIsSelected[0].data[1] - usdIsSelected[0].data[0]) /
							usdIsSelected[0].data[0]
					).toFixed(2) >= 0.01 ||
					parseFloat(
						(usdIsSelected[0].data[1] - usdIsSelected[0].data[0]) /
							usdIsSelected[0].data[0]
					).toFixed(2) <= -0.01
				) {
					messages.push({
						email: user.email,
						name: 'usd',
						priceChange:
							parseFloat(
								(usdIsSelected[0].data[1] -
									usdIsSelected[0].data[0]) /
									usdIsSelected[0].data[0]
							).toFixed(2) * 100,
					});
				}
			}
		});
	});

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
						title: `Giá USD(Đô la Mỹ) ${
							parseFloat(message?.priceChange) > 0
								? 'đang tăng'
								: 'đang giảm'
						}, kiểm tra ngay`,
						body: `Giá USD(Đô la Mỹ) đã ${
							parseFloat(message?.priceChange) > 0
								? 'tăng lên'
								: 'giảm xuống'
						} ${parseFloat(
							message?.priceChange > 0
								? message?.priceChange
								: -message?.priceChange
						).toFixed(
							2
						)}% trong 1 giờ qua. Giá USD(Đô la Mỹ) hiện tại là ${usdIsSelected[0]?.data[1]?.toLocaleString()}VND`,
						data: {
							type: 'foreignCurrency',
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

module.exports = { UsdChangePriceNotification };
