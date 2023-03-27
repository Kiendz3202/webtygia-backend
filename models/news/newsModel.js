const { number } = require('joi');
const mongoose = require('mongoose');

const newsSchema = mongoose.Schema(
	{
		timeUpdate: { type: Number, require: true },
		title: { type: String, require: true },
		image: { type: String, require: true },
		description: { type: String, require: true },
		keyword: [String],
		originSource: { type: String }, //link bài viết gốc
		quotation: { type: String }, // trích dẫn
		category: [String], // thể loại
		tag: [String],
		nameAdminPost: { type: String, require: true },
		avatarAdminPost: { type: String, require: true },
		content: { type: String, require: true },
	},
	{
		timestamps: true,
	}
);

const News = mongoose.model('News', newsSchema);
module.exports = News;
