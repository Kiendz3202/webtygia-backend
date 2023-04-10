const { default: axios } = require('axios');
const {
	uploadErrorToDb,
} = require('../../services/crawlingData/utils/error/uploadErrorToDb');

const translateByGoogleApi = async (from, to, content) => {
	const res = await axios
		.get(
			`https://translate.googleapis.com/translate_a/single?tl=${to}&dt=t&dt=bd&dj=1&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=at&sl=${from}&client=gtx&q=${content}`
		)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(err?.message);
		});
	let finalContent = '';
	res?.sentences.map((item) => {
		finalContent += item.trans;
	});
	return finalContent;
};

module.exports = { translateByGoogleApi };
