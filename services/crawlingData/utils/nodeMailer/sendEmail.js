const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

module.exports = async (email, subject, text) => {
	try {
		// const transporter = nodemailer.createTransport({
		// 	host: process.env.HOST,
		// 	service: process.env.SERVICE,
		// 	port: Number(process.env.EMAIL_PORT),
		// 	secure: Boolean(process.env.SECURE),
		// 	auth: {
		// 		user: process.env.USER,
		// 		pass: process.env.PASS,
		// 	},
		// 	tls: {
		// 		ciphers: 'SSLv3',
		// 	},
		// });
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'kiennguyenmanhtest3202@gmail.com',
				pass: 'cqpefujfzxpszvtu',
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
		});
		//================================================================
		// const oAuth2Client = new google.auth.OAuth2(
		// 	CLIENT_ID,
		// 	CLIENT_SECRET,
		// 	REDIRECT_URI
		// );
		// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

		// const accessToken = await oAuth2Client.getAccessToken();
		// const transporter = nodemailer.createTransport({
		// 	service: 'gmail',
		// 	auth: {
		// 		type: 'OAuth2',
		// 		user: process.env.USER,
		// 		clientId: CLIENT_ID,
		// 		clientSecret: CLIENT_SECRET,
		// 		refreshToken: REFRESH_TOKEN,
		// 		accessToken: accessToken,
		// 	},
		// });

		// await new Promise((resolve, reject) => {
		// 	// verify connection configuration
		// 	transporter.verify(function (error, success) {
		// 		if (error) {
		// 			console.log(error);
		// 			reject(error);
		// 		} else {
		// 			console.log('Server is ready to take our messages');
		// 			resolve(success);
		// 		}
		// 	});
		// });

		// await new Promise((resolve, reject) => {
		// 	// send mail
		// 	transporter.sendMail(
		// 		{
		// 			from: `"Web tỷ giá" <${process.env.USER}`,
		// 			to: email,
		// 			subject: subject,
		// 			text: text,
		// 		},
		// 		(err, info) => {
		// 			if (err) {
		// 				console.error(err);
		// 				reject(err);
		// 			} else {
		// 				console.log(info);
		// 				resolve(info);
		// 			}
		// 		}
		// 	);
		// });
	} catch (error) {
		console.log('Email not sent');
		console.log(error);
	}
};
