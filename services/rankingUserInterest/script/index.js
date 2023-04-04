const {
	decreasePointAccordingToTime,
	removeItemIfLessThanOrEqualZeroPoint,
} = require('../pointCronjob/index');
const cron = require('node-cron');
const { delay } = require('../../crawlingData/utils/promise/delay');

module.exports = async function () {
	cron.schedule('0 0 */2 * *', async () => {
		decreasePointAccordingToTime();
	});

	cron.schedule('0 * * * *', async () => {
		removeItemIfLessThanOrEqualZeroPoint();
	});
};
