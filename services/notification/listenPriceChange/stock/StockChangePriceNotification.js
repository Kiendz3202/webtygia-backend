const Coin = require('../../../../models/coin/coinModel');
const User = require('../../../../models/user/userModel');
const { Expo } = require('expo-server-sdk');
const sendNotificationByExpo = require('../../sendNotificationByExpo/sendNotificationByExpo');
const StockDetail = require('../../../../models/stock/stockDetail/stockDetailModel');

const StockChangePriceNotification = async (allTokenDevice) => {
	const stockIsSelected = await StockDetail.find({
		changePercent: { $ne: '' },
		$or: [
			{
				$expr: {
					$gte: [
						{
							$convert: {
								input: '$changePercent',
								to: 'double',
								onError: 0,
							},
						},
						2,
					],
				},
			},
			{
				$expr: {
					$lte: [
						{
							$convert: {
								input: '$changePercent',
								to: 'double',
								onError: 0,
							},
						},
						-2,
					],
				},
			},
		],
	}).select('symbol changePercent');

	const allUsers = await User.find();

	const messages = [];

	allUsers.map((user) => {
		user?.followStocks?.map((item) => {
			const stockMatch = stockIsSelected.filter(
				(stock) => stock._id.toString() === item.toString()
			);
			if (stockMatch.length > 0) {
				messages.push({
					email: user.email,
					symbol: stockMatch[0].symbol,
					priceChange: stockMatch[0].changePercent,
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
						} ${
							parseFloat(message?.priceChange).toFixed(2) > 0
								? parseFloat(message?.priceChange).toFixed(2)
								: -parseFloat(message?.priceChange).toFixed(2)
						}%. Xem ngay!`,
						data: {
							type: 'stock',
							nameId: message?.symbol,
							...message,
						},
					});
				}
			});
		}
	});
	sendNotificationByExpo(finalMessageToSend);
};

module.exports = { StockChangePriceNotification };
