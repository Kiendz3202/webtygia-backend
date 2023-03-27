const { uploadErrorToDb } = require('../../../utils/error/uploadErrorToDb');

const updatePetrolimex = async (dataJson, model) => {
	model
		.findOneAndUpdate(
			{ name: dataJson.name },
			{
				name: dataJson.name,
				timeUpdate: dataJson.timeUpdate,
				ron95v_1: dataJson.ron95v_1,
				ron95v_2: dataJson.ron95v_2,
				ron95III_1: dataJson.ron95III_1,
				ron95III_2: dataJson.ron95III_2,
				ron92II_1: dataJson.ron92II_1,
				ron92II_2: dataJson.ron92II_2,
				do0001SV_1: dataJson.do0001SV_1,
				do0001SV_2: dataJson.do0001SV_2,
				do005SII_1: dataJson.do005SII_1,
				do005SII_2: dataJson.do005SII_2,
				dauhoa_1: dataJson.dauhoa_1,
				dauhoa_2: dataJson.dauhoa_2,
			},
			{ upsert: true }
		)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' petrolimex'
			);
		});
};

module.exports = { updatePetrolimex };
