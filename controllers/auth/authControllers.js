const createError = require('http-errors');
const User = require('../../models/user/userModel');
const TokenVerifyEmail = require('../../models/token/tokenVerifyEmail');
const sendEmail = require('../../services/crawlingData/utils/nodeMailer/sendEmail');
const crypto = require('crypto');
const { userValidate } = require('../../helpers/validation/userValidate');
const {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} = require('../../helpers/jwt/jwt_service');
const TokenDevicePhone = require('../../models/token/tokenDevicePhone');

const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		const { error, value } = userValidate(req.body, 'signup');

		if (!req.file.originalname) {
			throw createError('Need upload avatar image');
		}
		if (error) {
			throw createError(error.details[0].message);
		}

		const isExists = await User.findOne({ email });

		if (isExists) {
			// throw createError.Conflict(`${email} is already registered`);
			return res.status(200).json({
				status: 'fail',
				message:
					'Tài khoản đã tồn tại, vui lòng đăng nhập bằng email hoặc Google',
			});
		}

		const user = new User({
			name,
			avatar: `${req.protocol}://${req.get('host')}${
				process.env.pathApi
			}/avatarImages/${req.file.filename}`,
			email,
			password,
		});

		const savedUser = await user.save();
		const userResponse = {
			name: savedUser.name,
			avatar: savedUser.avatar,
			email: savedUser.email,
			_id: savedUser._id,
		};

		//nodeMailer
		const token = await new TokenVerifyEmail({
			userId: savedUser._id,
			token: crypto.randomBytes(32).toString('hex'),
		}).save();
		const url = `${process.env.URL_FE}/authentication/verify-token-email?userid=${user._id}&token=${token.token}`;
		sendEmail(user.email, 'Xác thực Email', url);

		// return res.status(200).json({
		// 	status: 'ok',
		// 	data: userResponse,
		// });
		return res.status(200).send({
			status: 'fail',
			message: 'Vào hòm thư email để xác thực',
		});
	} catch (error) {
		next(error);
	}
};
const verifyEmail = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user)
			return res.status(200).send({
				status: 'fail',
				message: 'Đăng ký không thành công. Vui lòng thử lại!',
			});

		const token = await TokenVerifyEmail.findOne({
			userId: user._id,
			token: req.params.token,
		});

		if (!token)
			return res.status(200).send({
				status: 'fail',
				message: 'Xác thực không thành công. Vui lòng thử lại!',
			});

		await User.findOneAndUpdate({ _id: user._id }, { isVerified: true });
		await token.remove();

		res.status(200).send({
			status: 'ok',
			message: 'Xác thực thành công!',
		});
	} catch (error) {
		res.status(500).send({ status: 'fail', message: error.message });
	}
};

const login = async (req, res, next) => {
	try {
		const { error } = userValidate(req.body, 'login');

		if (error) {
			throw createError(error.details[0].message);
		}

		const { email, password, tokenDevicePhone } = req.body;

		if (tokenDevicePhone) {
			TokenDevicePhone.findOneAndUpdate(
				{ tokenDevicePhone },
				{ tokenDevicePhone, email },
				{ upsert: true }
			).catch((err) =>
				res.status(200).json({
					status: 'fail',
					message:
						'Cập nhật token device thất bại, vui lòng đăng nhập lại',
				})
			);
		}

		const user = await User.findOne({ email });

		if (!user) {
			// throw createError.NotFound('User not registered');
			return res.status(200).json({
				status: 'fail',
				message: 'Tài khoản không tồn tại, vui lòng đăng ký!',
			});
		}

		if (user.password) {
			const isValid = await user.comparePassword(password);

			if (!isValid) {
				// throw createError.Unauthorized();
				return res.status(200).json({
					status: 'fail',
					message: 'Mật khẩu không chính xác',
				});
			}

			//nodeMailer
			if (!user.isVerified) {
				let token = await TokenVerifyEmail.findOne({
					userId: user._id,
				});
				if (!token) {
					token = await new TokenVerifyEmail({
						userId: user._id,
						token: crypto.randomBytes(32).toString('hex'),
					}).save();
					const url = `${process.env.BASE_URL}authentication/verify-token-email?userid=${user._id}&token=${token.token}`;
					await sendEmail(user.email, 'Verify email', url);
				}
				return res.status(200).send({
					status: 'fail',
					message:
						'Tài khoản của bạn chưa được xác thực. Tin nhắn đã được gửi đến email của bạn, hãy vào và xác thực ngay!',
				});
			}

			const accessToken = await signAccessToken(user._id);
			// const refreshtoken = await signRefreshToken(user._id);

			res.status(200).json({
				status: 'ok',
				data: {
					accessToken,
					// refreshtoken,
					user: {
						_id: user._id,
						name: user.name,
						avatar: user.avatar,
						email: user.email,
					},
				},
			});
		} else {
			return res.status(200).json({
				status: 'fail',
				message:
					'Tài khoản đã được đăng ký, vui lòng đăng nhập bằng Google!',
			});
		}
	} catch (error) {
		next(error);
	}
};

const loginByGoogleForMobile = async (req, res, next) => {
	try {
		const { email, googleId, avatar, givenName } = req.body;

		// Check if google profile exist.
		if (googleId && email) {
			// googleId: profile.id;
			await User.findOne({ email })
				.then(async (existingUser) => {
					if (existingUser) {
						await User.findOneAndUpdate({ email }, { googleId })
							.then(async (user) => {
								//create access token
								const accessToken = await signAccessToken(
									user._id
								);
								res.status(200).json({
									status: 'ok',
									data: {
										accessToken,
										// refreshtoken,
										user: {
											_id: user._id,
											name: user.name,
											avatar: user.avatar,
											email: user.email,
										},
									},
								});
							})
							.catch((err) => next(err));
					} else {
						new User({
							googleId,
							email,
							avatar,
							name: givenName,
						})
							.save()
							.then(async (user) => {
								//create access token
								const accessToken = await signAccessToken(
									user._id
								);
								res.status(200).json({
									status: 'ok',
									data: {
										accessToken,
										// refreshtoken,
										user: {
											_id: user._id,
											name: user.name,
											avatar: user.avatar,
											email: user.email,
										},
									},
								});
							})
							.catch((err) => next(err));
					}
				})
				.catch((err) => next(err));
		} else {
			return res.status(200).json({
				status: 'fail',
				message:
					'Không nhận được GoogleID hoặc Email, vui lòng thử lại!',
			});
		}
	} catch (error) {
		next(error);
	}
};

const refreshtoken = async (req, res, next) => {
	try {
		const { refreshtoken } = req.body;
		if (!refreshtoken) throw createError.BadRequest();
		//nếu có refresh token thì đối chiếu nó xem có trong db redis không
		//nếu có thì xác thực tiếp bằng hàm verifyRefreshToken
		//còn nếu không hoặc trong blacklist thì sẽ return về lỗi

		const { userId } = await verifyRefreshToken(refreshtoken);
		const accessTokenNew = await signAccessToken(userId);
		// const refreshTokenNew = await signRefreshToken(userId);
		res.send({
			status: 'ok',
			data: {
				accessTokenNew,
				// refreshTokenNew,
			},
		});
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	// try {
	// 	const { refreshtoken } = req.body;
	// 	if (!refreshtoken) {
	// 		throw createError.BadRequest();
	// 	}

	// 	const { usesrId } = await verifyRefreshToken(refreshtoken);
	// 	//xoá refresh token trong redis
	// } catch (error) {
	// 	next(error);
	// }
	try {
		const { email, tokenDevicePhone } = req.body;

		if (!email) {
			return res.status(200).json({
				status: 'fail',
				message: 'Email rỗng',
			});
		}
		if (!tokenDevicePhone) {
			return res.status(200).json({
				status: 'fail',
				message: 'Token device không xác định',
			});
		}

		await TokenDevicePhone.findOneAndDelete({ tokenDevicePhone }).catch(
			(err) => {
				next(err);
			}
		);
		return res.status(200).json({
			status: 'ok',
			message: 'Đăng xuất thành công',
		});
	} catch (error) {
		next(error);
	}
};

const updateTokenDeviceLoginGoogle = async (req, res, next) => {
	try {
		const { email, tokenDevicePhone } = req.body;
		// console.log(req.body);

		if (tokenDevicePhone && email) {
			await TokenDevicePhone.findOneAndUpdate(
				{ tokenDevicePhone },
				{ tokenDevicePhone, email },
				{ upsert: true }
			).catch((err) =>
				res.status(200).json({
					status: 'fail',
					message:
						'Cập nhật token device thất bại, vui lòng đăng nhập lại!',
				})
			);

			return res.status(200).json({
				staus: 'ok',
				message: 'Cập nhật token device thành công!',
			});
		}

		return res.status(200).json({
			status: 'fail',
			message: 'Cập nhật device token thất bại, vui lòng đăng nhập lại!',
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	register,
	verifyEmail,
	login,
	refreshtoken,
	logout,
	updateTokenDeviceLoginGoogle,
	loginByGoogleForMobile,
};
