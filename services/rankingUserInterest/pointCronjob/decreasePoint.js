const UserInterest = require('../../../models/user/userInterestModel');
const {
	uploadErrorToDb,
} = require('../../crawlingData/utils/error/uploadErrorToDb');

const decreasePoint = async () => {
	const result = await UserInterest.updateMany({}, [
		// {
		// 	$set: {
		// 		score: {
		// 			$switch: {
		// 				branches: [
		// 					{
		// 						case: { $eq: ['$follow', 0] },
		// 						then: { $subtract: ['$score', 5] },
		// 					},
		// 					{
		// 						case: { $eq: ['$follow', 1] },
		// 						then: { $subtract: ['$score', 1] },
		// 					},
		// 				],
		// 			},
		// 		},
		// 	},
		// },
		{
			$set: {
				score: {
					$switch: {
						branches: [
							{
								case: { $eq: ['$follow', 0] },
								then: { $subtract: ['$score', 5] },
							},
							{
								case: {
									$and: [
										{ $eq: ['$follow', 1] },
										{ $gt: ['$score', 20] },
									],
								},
								then: { $subtract: ['$score', 1] },
							},
						],
						default: '$score',
					},
				},
			},
		},
	]).catch((err) => {
		uploadErrorToDb(err?.message);
	});
};

module.exports = { decreasePoint };
