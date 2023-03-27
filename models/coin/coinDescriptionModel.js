const mongoose = require('mongoose');

//coins/markets đáp ứng đủ cái này nhưng chỉ 1 loại usd or vnd chứ k lấy dc giá của cả 2 loại tiên

const coinDescriptionSchema = mongoose.Schema(
	{
		nameId: { type: 'String' },
		symbol: { type: 'String' },
		description: { type: 'String', default: '' }, //description.en
		homepage: { type: 'String', default: '' }, // links.homepage[0]
		official_forum_url: { type: 'String', default: '' }, //links.official_forum_url[0]
		github: { type: 'String', default: '' }, //links.repos_url.github[0]
		descriptionTranslateToVN: [String],
	},
	{
		timestamps: true,
	}
);

const CoinDescription = mongoose.model(
	'CoinDescription',
	coinDescriptionSchema
);

module.exports = CoinDescription;
