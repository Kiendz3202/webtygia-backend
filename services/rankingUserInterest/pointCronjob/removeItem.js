const UserInterest = require('../../../models/user/userInterestModel');
const {
	uploadErrorToDb,
} = require('../../crawlingData/utils/error/uploadErrorToDb');

const removeItem = async () => {
	const result = await UserInterest.findOneAndRemove({
		score: { $lte: 0 },
	}).catch((err) => {
		uploadErrorToDb(err?.message);
	});
};

module.exports = { removeItem };
