const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const connect = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`mongoDB connected: ${connect.connection.host}`);
	} catch (err) {
		console.log(err.message);
		process.exit();
	}
};

module.exports = connectDB;
