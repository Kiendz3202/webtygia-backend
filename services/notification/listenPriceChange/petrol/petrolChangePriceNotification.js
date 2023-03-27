const User = require('../../../../models/user/userModel');
const { Expo } = require('expo-server-sdk');
const sendNotificationByExpo = require('../../sendNotificationByExpo/sendNotificationByExpo');
const SjcChart = require('../../../../models/gold/sjcChartModel');
const Petrolimexchart = require('../../../../models/petrol/petrolimexChartModel');

const PetrolChangePriceNotification = async (allTokenDevice) => {
	const petrolIsSelected = await Petrolimexchart.aggregate([
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
				data: { $slice: ['$price', -2] },
				name: 1,
			},
		},
	]);

	const allUsers = await User.find();

	const messages = [];

	allUsers.map((user) => {
		user?.followPetrols?.map((item) => {
			// const goldMatch = petrolIsSelected.filter(
			// 	(gold) => gold._id.toString() === item.toString()
			// );
			if (item) {
				if (
					parseFloat(
						(petrolIsSelected[0].data[1] -
							petrolIsSelected[0].data[0]) /
							petrolIsSelected[0].data[0]
					).toFixed(2) >= 0.03 ||
					parseFloat(
						(petrolIsSelected[0].data[1] -
							petrolIsSelected[0].data[0]) /
							petrolIsSelected[0].data[0]
					).toFixed(2) <= -0.03
				) {
					messages.push({
						email: user.email,
						name: petrolIsSelected[0].name,
						priceChange:
							parseFloat(
								(petrolIsSelected[0].data[1] -
									petrolIsSelected[0].data[0]) /
									petrolIsSelected[0].data[0]
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
						title: `Giá xăng RON III ${
							parseFloat(message?.priceChange) > 0
								? 'đang tăng'
								: 'đang giảm'
						}, kiểm tra ngay`,
						body: `Giá xăng RON III đã ${
							parseFloat(message?.priceChange) > 0
								? 'tăng lên'
								: 'giảm xuống'
						} ${parseFloat(
							message?.priceChange > 0
								? message?.priceChange
								: -message?.priceChange
						).toFixed(
							2
						)}% trong 1 giờ qua. Giá Giá xăng RON III hiện tại là ${petrolIsSelected[0]?.data[1]?.toLocaleString()}VND`,
						data: {
							type: 'petrol',
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

module.exports = { PetrolChangePriceNotification };
