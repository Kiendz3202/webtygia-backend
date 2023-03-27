const Coin = require('../../../../models/coin/coinModel');
const User = require('../../../../models/user/userModel');
const { Expo } = require('expo-server-sdk');
const sendNotificationByExpo = require('../../sendNotificationByExpo/sendNotificationByExpo');

const CoinChangePriceNotification = async (allTokenDevice) => {
	// const coinIsSelected = await Coin.aggregate([
	// 	{
	// 		$match: {
	// 			priceChange1hPercent: {
	// 				$gt: '5',
	// 			},
	// 		},
	// 	},
	// 	{
	// 		$project: {
	// 			_id: 1,
	// 			nameId: 1,
	// 			symbol: 1,
	// 			priceChange1hPercent: 1,
	// 		},
	// 	},
	// ]);
	const coinIsSelected = await Coin.find({
		priceChange1hPercent: { $ne: '' },
		$or: [
			{
				$expr: {
					$gte: [
						{
							$convert: {
								input: '$priceChange1hPercent',
								to: 'double',
								onError: 0,
							},
						},
						5,
					],
				},
			},
			{
				$expr: {
					$lte: [
						{
							$convert: {
								input: '$priceChange1hPercent',
								to: 'double',
								onError: 0,
							},
						},
						-5,
					],
				},
			},
		],
	}).select('symbol nameId priceChange1hPercent currentPrice');

	const allUsers = await User.find();

	const messages = [];

	allUsers.map((user) => {
		user?.followCoins?.map((item) => {
			const coinMatch = coinIsSelected.filter(
				(coin) => coin?._id?.toString() === item?.toString()
			);
			if (coinMatch?.length > 0) {
				messages.push({
					email: user.email,
					nameId: coinMatch[0]?.nameId,
					symbol: coinMatch[0]?.symbol,
					priceChange: coinMatch[0]?.priceChange1hPercent,
					currentPrice: coinMatch[0]?.currentPrice,
				});
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
						title: `${message?.symbol.toUpperCase()} ${
							parseFloat(message?.priceChange) > 0
								? 'đang tăng'
								: 'đang giảm'
						}, kiểm tra ngay`,
						body: `Giá ${message?.symbol.toUpperCase()} đã ${
							parseFloat(message?.priceChange) > 0
								? 'tăng lên'
								: 'giảm xuống'
						} ${parseFloat(
							message?.priceChange > 0
								? message?.priceChange
								: -message?.priceChange
						).toFixed(
							2
						)}% trong 1 giờ qua. Giá ${message?.symbol.toUpperCase()} hiện tại là $${
							message?.currentPrice
						}`,
						data: {
							type: 'coin',
							nameId: message?.nameId,
							...message,
						},
					});
				}
			});
		}
	});
	sendNotificationByExpo(finalMessageToSend);
};

module.exports = { CoinChangePriceNotification };
