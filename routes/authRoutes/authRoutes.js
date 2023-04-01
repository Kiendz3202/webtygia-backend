const {
	register,
	verifyEmail,
	login,
	refreshtoken,
	logout,
	updateTokenDeviceLoginGoogle,
	loginByGoogleForMobile,
} = require('../../controllers/auth/authControllers');
// import middleware
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');
app.use(express.static('public'));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(
			null,
			path.join(__dirname, '../../public/avatarImages'),
			function (error, success) {
				if (error) {
					console.log(error);
				}
			}
		);
	},
	filename: function (req, file, cb) {
		const name = Date.now() + '-' + file.originalname;
		cb(null, name, function (error, success) {
			if (error) {
				console.log(error);
			}
		});
	},
});

const upload = multer({ storage: storage });

app.post(`/register`, upload.single('avatar'), register);
app.post(`/login`, upload.single('avatar'), login);
app.post(`/logout`, upload.single('avatart'), logout);
app.post(`/update-token-device-login-google`, updateTokenDeviceLoginGoogle);
app.get('/:id/verify/:token', verifyEmail);
app.post('/login/mobile', loginByGoogleForMobile);

module.exports = app;

// module.exports = function (app, pathApi) {
// 	app.post(`${pathApi}/register`, register);

// 	app.post(`${pathApi}/refresh-token`, refreshtoken);

// 	app.post(`${pathApi}/login`, login);

// 	app.delete(`${pathApi}/logout`, logout);
// };
