const { decreasePoint } = require('./decreasePoint');
const { removeItem } = require('./removeItem');

const decreasePointAccordingToTime = async () => {
	decreasePoint();
};

const removeItemIfLessThanOrEqualZeroPoint = async () => {
	removeItem();
};

module.exports = {
	decreasePointAccordingToTime,
	removeItemIfLessThanOrEqualZeroPoint,
};
