const { createPost } = require('../../controllers/admin/adminController');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');
app.use(express.static('public'));

// module.exports = function (app, pathApi) {
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(
			null,
			path.join(__dirname, '../../public/postImages'),
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

app.post(`/create-news`, upload.single('image'), createPost);
// app.get('/get-list-news', getPaginationPosts);
// app.get('/get-all-news', getAllPosts);
// app.get('/get-detail-news/:id', getDetailPost);

// };

module.exports = app;
