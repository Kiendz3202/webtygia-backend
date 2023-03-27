const Coin = require('../../models/coin/coinModel');
// const CoinChart = require('../../models/coin/chartCoin/chartCoinModel');
const CoinDescription = require('../../models/coin/coinDescriptionModel');
const CoinChart1D = require('../../models/coin/chartCoin/chart1DModel');
const CoinChart90D = require('../../models/coin/chartCoin/chart90DModel');
const CoinChartMax = require('../../models/coin/chartCoin/chartMaxModel');
const createError = require('http-errors');
const User = require('../../models/user/userModel');
const UserInterest = require('../../models/user/userInterestModel');
const Hnx = require('../../models/stock/stockList/hnxModel');
const Hnx30 = require('../../models/stock/stockList/hnx30Model');
const News = require('../../models/news/newsModel');
const StockDetail = require('../../models/stock/stockDetail/stockDetailModel');
const AgribankInterestRate = require('../../models/interestRate/agribankInterestRateModel');
const MbbankInterestRate = require('../../models/interestRate/mbbankInterestRateModel');
const ScbInterestRate = require('../../models/interestRate/scbInterestRateModel');
const VibInterestRate = require('../../models/interestRate/vibInterestRateModel');
const VietcombankInterestRate = require('../../models/interestRate/vietcombankInterestRateModel');
const VietinbankInterestRate = require('../../models/interestRate/vietinbankInterestRateModel');
const AgribankExchange = require('../../models/exchangeRate/agribankExchangeModel');
const BidvExchange = require('../../models/exchangeRate/bidvExchangeModel');
const MbbankExchange = require('../../models/exchangeRate/mbbankExchangeModel');
const TechcombankExchange = require('../../models/exchangeRate/techcombankExchangeModel');
const VietcombankExchange = require('../../models/exchangeRate/vietcombankExchangeModel');
const VietinBankExchange = require('../../models/exchangeRate/vietinbankExchangeModel');
const Petrolimex = require('../../models/petrol/petrolimexModel');

const searchPartial = async (req, res, next) => {
	let payload = req.body.payload.trim();

	let promises = [];

	//coin
	promises.push(
		Coin.find({
			// nameId: { $regex: new RegExp(payload) },
			// nameId: { $regex: new RegExp('^' + payload + '.*'), $options: 'i' },
			$or: [
				{
					nameId: {
						$regex: payload,
						$options: 'i',
					},
				},
				{
					symbol: {
						$regex: payload,
						$options: 'i',
					},
				},
			],
		})
			.select('nameId symbol  image ')
			.lean()
	);

	//stock
	promises.push(
		await StockDetail.find({
			// symbol: { $regex: new RegExp('^' + payload + '.*'), $options: 'i' },
			$or: [
				{
					symbol: {
						$regex: payload,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: payload,
						$options: 'i',
					},
				},
			],
		})
			.select('symbol name')
			.lean()
	);

	//news
	promises.push(
		await News.find({
			$or: [
				{
					title: {
						$regex: payload,
						$options: 'i',
					},
				},
				{
					description: {
						$regex: payload,
						$options: 'i',
					},
				},
				{
					content: {
						$regex: payload,
						$options: 'i',
					},
				},
			],
		})
			.select('title image timeUpdate')
			.lean()
	);

	//usd
	if (payload.toUpperCase() === 'USD') {
		promises.push([
			{
				name: 'USD',
				category: 'foreignCurrency',
				href: '/ty-gia-ngoai-te',
				image: 'https://vectorflags.s3.amazonaws.com/flags/us-square-01.png',
			},
		]);
	} else {
		promises.push([]);
	}

	//xăng dầu
	const existingStringPetrolimex =
		'Tập đoàn Xăng dầu Việt Nam tap doan xang dau viet nam Petrolimex xang dau xangdau petrol giá xăng dầu gia xang dau giá dầu gia dau giá xăng gia xang'.toLowerCase();

	// Perform the search as before
	if (existingStringPetrolimex.includes(payload)) {
		promises.push([
			{
				name: 'Petrolimex',
				href: '/gia-xang-dau',
				image: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Petrolimex-PLX.png',
				category: 'petrol',
			},
		]);
	} else {
		promises.push([]);
	}

	//interestrate(lãi suất)
	const existingStringAgribankInterest =
		'lãi suất ngân hàng lai suat ngan hang Agribank Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam Agribank Ngan hang Nong nghiep va Phat trien Nong thon Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringAgribankInterest.includes(payload)) {
		promises.push([
			{
				name: 'Lãi suất Agribank',
				href: '/lai-suat-ngan-hang/agribank',
				image: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Agribank-V.png',
				category: 'interestRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringMbbankInterest =
		'lãi suất ngân hàng lai suat ngan hang MBBank Ngân hàng TMCP Quân đội MBBank Ngan hang TMCP Quan doi mb'.toLowerCase();

	// Perform the search as before
	if (existingStringMbbankInterest.includes(payload)) {
		promises.push([
			{
				name: 'Lãi suất Mbbank',
				href: '/lai-suat-ngan-hang/mbbank',
				image: 'https://inkythuatso.com/uploads/images/2021/11/mb-bank-logo-inkythuatso-01-10-09-01-10.jpg',
				category: 'interestRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringscbInterest =
		'lãi suất ngân hàng lai suat ngan hang SCB Ngân hàng Thương Mại Cổ Phần Sài Gòn SCB  Ngan hang Thuong Mai Co Phan Sai Gon'.toLowerCase();

	// Perform the search as before
	if (existingStringscbInterest.includes(payload)) {
		promises.push([
			{
				name: 'Lãi suất Scb',
				href: '/lai-suat-ngan-hang/scb',
				image: 'https://www.scb.com.vn/picture/y_nghi_logo_scb_truc_doc_1_.webp',
				category: 'interestRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringvibInterest =
		'lãi suất ngân hàng lai suat ngan hang VIB Ngân hàng Thương mại cổ phần Quốc Tế Việt Nam VIB Ngan hang Thuong mai co phan Quoc Te Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringvibInterest.includes(payload)) {
		promises.push([
			{
				name: 'Lãi suất Vib',
				href: '/lai-suat-ngan-hang/vib',
				image: 'https://static.wixstatic.com/media/9d8ed5_e8f0cd6914be4a50a8c93e800748313a~mv2.jpg/v1/fill/w_1182,h_1182,al_c,q_85/9d8ed5_e8f0cd6914be4a50a8c93e800748313a~mv2.jpg',
				category: 'interestRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringVietcombankbankInterest =
		'lãi suất ngân hàng lai suat ngan hang Vietcombank Ngân hàng thương mại cổ phần Ngoại thương Việt Nam Vietcombank Ngan hang thuong mai co phan Ngoai thuong Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringVietcombankbankInterest.includes(payload)) {
		promises.push([
			{
				name: 'Lãi suất Vietcombankbank',
				href: '/lai-suat-ngan-hang/vietcombank',
				image: 'https://www.inlogo.vn/vnt_upload/File/Image/logo_VCB_828891.jpg',
				category: 'interestRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringVietinbankInterest =
		'lãi suất ngân hàng lai suat ngan hang VietinBank Ngân hàng Thương mại cổ phần Công Thương Việt Nam VietinBank Ngan hang Thuong mai co phan Cong Thuong Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringVietinbankInterest.includes(payload)) {
		promises.push([
			{
				name: 'Lãi suất Vietinbank',
				href: '/lai-suat-ngan-hang/vietinbank',
				image: 'https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/TienIch/NganHang/VietinBank/vietinbank_637018943312743351.jpg',
				category: 'interestRate',
			},
		]);
	} else {
		promises.push([]);
	}

	//exchangerate(ty gia ngoai te ngan hang)
	const existingStringAgribankExchange =
		'ty gia ngoai te ngan hang tỷ giá ngoại tệ ngân hàng Agribank Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam Agribank Ngan hang Nong nghiep va Phat trien Nong thon Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringAgribankExchange.includes(payload)) {
		promises.push([
			{
				name: 'Ngoại tệ Agribank',
				href: '/ty-gia-ngoai-te/agribank',
				image: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Agribank-V.png',
				category: 'exchangeRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringBidvExchange =
		'ty gia ngoai te ngan hang tỷ giá ngoại tệ ngân hàng BIDV Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam BIDV Ngan hang Thuong mai co phan Dau tu va Phat trien Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringBidvExchange.includes(payload)) {
		promises.push([
			{
				name: 'Ngoại tệ Bidv',
				href: '/ty-gia-ngoai-te/bidv',
				image: 'https://static.wixstatic.com/media/9d8ed5_ee14e082b86542d49a8a4460f290c976~mv2.png/v1/fill/w_1182,h_1182,al_c/9d8ed5_ee14e082b86542d49a8a4460f290c976~mv2.png',
				category: 'exchangeRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringMbbankExchange =
		'ty gia ngoai te ngan hang tỷ giá ngoại tệ ngân hàng MBBank Ngân hàng TMCP Quân đội MBBank Ngan hang TMCP Quan doi'.toLowerCase();

	// Perform the search as before
	if (existingStringMbbankExchange.includes(payload)) {
		promises.push([
			{
				name: 'Ngoại tệ Mbbank',
				href: '/ty-gia-ngoai-te/mbbank',
				image: 'https://inkythuatso.com/uploads/images/2021/11/mb-bank-logo-inkythuatso-01-10-09-01-10.jpg',
				category: 'exchangeRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringTechcombankbankExchange =
		'ty gia ngoai te ngan hang tỷ giá ngoại tệ ngân hàng Techcombank Ngân hàng Thương mại cổ phần Kỹ Thương Việt Nam Techcombank Ngan hang Thuong mai co phan Ky Thuong Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringTechcombankbankExchange.includes(payload)) {
		promises.push([
			{
				name: 'Ngoại tệ Techcombankbank',
				href: '/lai-suat-ngan-hang/techcombank',
				image: 'https://inminhkhang.com/wp-content/uploads/2022/03/giai-ma-logo-techcombank-tai-mien-phi-file-logo-techcombank-vector-4.png',
				category: 'ExchangeRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringVietcombankbankExchange =
		'ty gia ngoai te ngan hang tỷ giá ngoại tệ ngân hàng Vietcombank Ngân hàng thương mại cổ phần Ngoại thương Việt Nam Vietcombank Ngan hang thuong mai co phan Ngoai thuong Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringVietcombankbankExchange.includes(payload)) {
		promises.push([
			{
				name: 'Ngoại tệ Vietcombankbank',
				href: '/lai-suat-ngan-hang/vietcombank',
				image: 'https://www.inlogo.vn/vnt_upload/File/Image/logo_VCB_828891.jpg',
				category: 'ExchangeRate',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringVietinbankExchange =
		'ty gia ngoai te ngan hang tỷ giá ngoại tệ ngân hàng VietinBank Ngân hàng Thương mại cổ phần Công Thương Việt Nam VietinBank Ngan hang Thuong mai co phan Cong Thuong Viet Nam'.toLowerCase();

	// Perform the search as before
	if (existingStringVietinbankExchange.includes(payload)) {
		promises.push([
			{
				name: 'Ngoại tệ Vietinbank',
				href: '/lai-suat-ngan-hang/vietinbank',
				image: 'https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/TienIch/NganHang/VietinBank/vietinbank_637018943312743351.jpg',
				category: 'ExchangeRate',
			},
		]);
	} else {
		promises.push([]);
	}

	//list coin
	const existingStringListcoin =
		'tiền ảo tiền mã hoá coin crypto currency nft tiền điện tử blockchain Cryptocurrency defi tien ao tien ma hoa tien dien tu'.toLowerCase();

	// Perform the search as before
	if (existingStringListcoin.includes(payload)) {
		promises.push([
			{
				name: 'Thị trường tiền điên tử',
				href: '/coin',
				image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/bitcoin-logo-btc-crypto-mining-cryptocurrency-gift-thomas-larch.jpg',
				category: 'coin',
			},
		]);
	} else {
		promises.push([]);
	}

	//list stock
	const existingStringListHnxstock =
		'cổ phiếu chứng khoán Thị trường chứng khoán hnx Sở Giao dịch Chứng khoán Hà Nội co phieu chung khoan Thi truong chung khoan hnx So Giao dich Chung khoan Ha Noi'.toLowerCase();

	// Perform the search as before
	if (existingStringListHnxstock.includes(payload)) {
		promises.push([
			{
				name: 'Cổ phiếu HNX',
				href: '/co-phieu/hnx',
				category: 'stock',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringListHnx30stock =
		'cổ phiếu chứng khoán Thị trường chứng khoán hnx Sở Giao dịch Chứng khoán Hà Nội co phieu chung khoan Thi truong chung khoan hnx So Giao dich Chung khoan Ha Noi'.toLowerCase();

	// Perform the search as before
	if (existingStringListHnx30stock.includes(payload)) {
		promises.push([
			{
				name: 'Cổ phiếu HNX30',
				href: '/co-phieu/hnx30',
				category: 'stock',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringListHosestock =
		'cổ phiếu chứng khoán co phieu chung khoan Sở Giao dịch Chứng khoán Thành phố Hồ Chí Minh, tiền thân là Trung tâm Giao dịch Chứng khoán Thành phố Hồ Chí Minh hose So Giao dich Chung khoan Thanh pho Ho Chi Minh, tien than la Trung tam Giao dich Chung khoan Thanh pho Ho Chi Minh hose'.toLowerCase();

	// Perform the search as before
	if (existingStringListHosestock.includes(payload)) {
		promises.push([
			{
				name: 'Cổ phiếu HOSE',
				href: '/co-phieu/hose',
				category: 'stock',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringListVn30stock =
		'cổ phiếu chứng khoán co phieu chung khoan Sở Giao dịch Chứng khoán Thành phố Hồ Chí Minh, tiền thân là Trung tâm Giao dịch Chứng khoán Thành phố Hồ Chí Minh hose vn30 So Giao dich Chung khoan Thanh pho Ho Chi Minh, tien than la Trung tam Giao dich Chung khoan Thanh pho Ho Chi Minh hose vn30'.toLowerCase();

	// Perform the search as before
	if (existingStringListVn30stock.includes(payload)) {
		promises.push([
			{
				name: 'Cổ phiếu VN30',
				href: '/co-phieu/vn30',
				category: 'stock',
			},
		]);
	} else {
		promises.push([]);
	}

	//vàng
	const existingStringSjc =
		'giá vàng gia vang trang sức cao cấp trang suc cao cap Công Ty TNHH Một Thành Viên Vàng Bạc Đá Quý Sài Gòn SJC Cong Ty TNHH Mot Thanh Vien Vang Bac Da Quy Sai Gon vàng nhẫn vang nhan Vàng nữ trang vang nu trang Vàng SJC vang sjc'.toLowerCase();

	// Perform the search as before
	if (existingStringSjc.includes(payload)) {
		promises.push([
			{
				name: 'Vàng SJC',
				href: '/gia-vang/sjc',
				image: 'https://printgo.vn/uploads/file-logo/1/512x512.075e191500b6b0dd513f7d34d8bbfa77.ai.1.png',
				category: 'gold',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringPnj =
		'giá vàng gia vang trang sức cao cấp trang suc cao cap Công ty Cổ Phần Vàng Bạc Đá Quý Phú Nhuận pnj Vàng miếng SJC Nhẫn Trơn PNJ Vàng Kim Bảo Vàng Phúc Lộc Tài Vàng 24K Vàng miếng PNJ Cong ty Co Phan Vang Bac Da Quy Phu Nhuan pnj Vang mieng SJC Nhan Tron PNJ Vang Kim Bao Vang Phuc Loc Tai Vang 24K Vang mieng PNJ'.toLowerCase();

	// Perform the search as before
	if (existingStringPnj.includes(payload)) {
		promises.push([
			{
				name: 'Vàng Pnj',
				href: '/gia-vang/pnj',
				image: 'https://brademar.com/wp-content/uploads/2022/09/PNJ-Logo-PNG-1.png',
				category: 'gold',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringDoji =
		'giá vàng gia vang trang sức cao cấp trang suc cao cap Tập đoàn Vàng Bạc Đá Quý DOJI Tap doan Vang Bac Da Quy DOJI'.toLowerCase();

	// Perform the search as before
	if (existingStringDoji.includes(payload)) {
		promises.push([
			{
				name: 'Vàng Doji',
				href: '/gia-vang/doji',
				image: 'https://gigamall.com.vn/data/2019/09/20/16350118_LOGO-DOJI.png',
				category: 'gold',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringPhuQuySjc =
		'giá vàng gia vang trang sức cao cấp trang suc cao cap Vàng Bạc Đá Quý Vàng Phú Quý vang phu quy phu quy sjc Tap doan Vang Bac Da Quy PhuQuySjc'.toLowerCase();

	// Perform the search as before
	if (existingStringPhuQuySjc.includes(payload)) {
		promises.push([
			{
				name: 'Vàng Phú Quý',
				href: '/gia-vang/phu-quy-sjc',
				image: 'http://theme.hstatic.net/200000061680/1000549213/14/share_fb_home.png?v=693',
				category: 'gold',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringBTMC =
		'giá vàng gia vang trang sức cao cấp trang suc cao cap Vàng Bạc Đá Quý Vàng Bảo Tín Minh Châu bao tin minh chau baotinminhchau Tap doan Vang Bac Da Quy BTMC Vàng Rồng Thăng Long vang rong thang long'.toLowerCase();

	// Perform the search as before
	if (existingStringBTMC.includes(payload)) {
		promises.push([
			{
				name: 'Vàng Bảo Tín Mich Châu',
				href: '/gia-vang/bao-tin-minh-chau',
				image: 'https://cdnimg.vietnamplus.vn/Uploaded/Subjects/1395653299_1.jpg',
				category: 'gold',
			},
		]);
	} else {
		promises.push([]);
	}
	const existingStringMiHong =
		'giá vàng gia vang trang sức cao cấp trang suc cao cap Vàng Bạc Đá Quý Vàng mi hong mihong Mi Hồng Tap doan Vang Bac Da Quy MiHong'.toLowerCase();

	// Perform the search as before
	if (existingStringMiHong.includes(payload)) {
		promises.push([
			{
				name: 'Vàng Mi Hồng',
				href: '/gia-vang/mi-hong',
				image: 'https://mihong.vn/themes/mihong/images/logo.png',
				category: 'gold',
			},
		]);
	} else {
		promises.push([]);
	}

	// // interest(lai suat)
	// promises.push(
	// 	await AgribankInterestRate.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await MbbankInterestRate.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await ScbInterestRate.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await VibInterestRate.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await VietcombankInterestRate.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await VietinbankInterestRate.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );

	// // exchange(ty gia ngoai te cac ngan hang)
	// promises.push(
	// 	await AgribankExchange.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await BidvExchange.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await MbbankExchange.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await TechcombankExchange.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await VietcombankExchange.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );
	// promises.push(
	// 	await VietinBankExchange.find({
	// 		$or: [
	// 			{
	// 				symbol: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('symbol name')
	// 		.lean()
	// );

	// // xăng dầu
	// promises.push(
	// 	await Petrolimex.find({
	// 		$or: [
	// 			{
	// 				name: {
	// 					$regex: payload,
	// 					$options: 'i',
	// 				},
	// 			},
	// 			{
	// 				description: {
	// 					$regex: new RegExp('^' + payload + '.*'),
	// 					$options: 'i',
	// 				},
	// 			},
	// 		],
	// 	})
	// 		.select('name')
	// 		.lean()
	// );

	//combine all promise
	Promise.all(promises)
		.then(async (results) => {
			let coinResults = results[0].map((item) => ({
				...item,
				href: `/coin/${item.nameId}`,
				category: 'coin',
			}));
			let stockResults = results[1].map((item) => ({
				...item,
				href: `/co-phieu/${item.symbol}`,
				category: 'stock',
			}));
			let newsResults = results[2].map((item) => ({
				...item,
				href: `/tin-tuc/${item.timeUpdate}`,
				category: 'news',
			}));
			let usdResult = results[3];

			// // //xăng dầu
			// let petrolimexResults = results[4].map((item) => ({
			// 	...item,
			// 	href: '/gia-xang-dau',
			// 	category: 'petrol',
			// }));

			// // interest(lai suat)
			// let agribankInterestResults = results[5].map((item) => ({
			// 	...item,
			// 	href: '/lai-suat-ngan-hang/agribank',
			// 	category: 'interestRate',
			// }));
			// let mbbankInterestResults = results[5].map((item) => ({
			// 	...item,
			// 	href: '/lai-suat-ngan-hang/mbbank',
			// 	category: 'interestRate',
			// }));
			// let scbInterestResults = results[6].map((item) => ({
			// 	...item,
			// 	href: '/lai-suat-ngan-hang/scb',
			// 	category: 'interestRate',
			// }));
			// let vibInterestResults = results[7].map((item) => ({
			// 	...item,
			// 	href: '/lai-suat-ngan-hang/vib',
			// 	category: 'interestRate',
			// }));
			// let vietcombankInterestResults = results[8].map((item) => ({
			// 	...item,
			// 	href: '/lai-suat-ngan-hang/vietcombank',
			// 	category: 'interestRate',
			// }));
			// let vietinbankInterestResults = results[9].map((item) => ({
			// 	...item,
			// 	href: '/lai-suat-ngan-hang/vietinbank',
			// 	category: 'interestRate',
			// }));

			// //exchangeRate(ty gia ngoai te các ngân hàng)
			// let agribankExchangeRateResults = results[10].map((item) => ({
			// 	...item,
			// 	href: '/ty-gia-ngoai-te/agribank',
			// 	category: 'exchangeRate',
			// }));
			// let bidvExchangeRateResults = results[11].map((item) => ({
			// 	...item,
			// 	href: '/ty-gia-ngoai-te/bidv',
			// 	category: 'exchangeRate',
			// }));
			// let mbbankExchangeRateResults = results[12].map((item) => ({
			// 	...item,
			// 	href: '/ty-gia-ngoai-te/mbbank',
			// 	category: 'exchangeRate',
			// }));
			// let techcombankExchangeRateResults = results[13].map((item) => ({
			// 	...item,
			// 	href: '/ty-gia-ngoai-te/techcombank',
			// 	category: 'exchangeRate',
			// }));
			// let vietcombankExchangeRateResults = results[14].map((item) => ({
			// 	...item,
			// 	href: '/ty-gia-ngoai-te/vietcombank',
			// 	category: 'exchangeRate',
			// }));
			// let vietinbankExchangeRateResults = results[15].map((item) => ({
			// 	...item,
			// 	href: '/ty-gia-ngoai-te/vietinbank',
			// 	category: 'exchangeRate',
			// }));

			const finalResults = [
				...coinResults,
				...stockResults,
				...usdResult,
				...results[4],
				...results[5],
				...results[6],
				...results[7],
				...results[8],
				...results[9],
				...results[10],
				...results[11],
				...results[12],
				...results[13],
				...results[14],
				...results[15],
				...results[16],
				...results[17],
				...results[18],
				...results[19],
				...results[20],
				...results[21],
				...results[22],
				...results[23],
				...results[24],
				...results[25],
				...results[26],
				...results[27],
				...newsResults,
				// ...mbbankInterestResults,
				// ...scbInterestResults,
				// ...vibInterestResults,
				// ...vietcombankInterestResults,
				// ...vietinbankInterestResults,
				// ...agribankExchangeRateResults,
				// ...bidvExchangeRateResults,
				// ...mbbankExchangeRateResults,
				// ...techcombankExchangeRateResults,
				// ...vietcombankExchangeRateResults,
				// ...vietinbankExchangeRateResults,
				// ...petrolimexResults,
			];
			// results[0] will have docs of first query
			// results[1] will have docs of second query
			// and so on...

			// you can combine all the results here and send back in response
			// console.log(finalResults);
			res.status(200).json({
				status: 'ok',
				data: finalResults,
			});
		})
		.catch((err) => {
			//handle error here
			next(err);
		});
};

module.exports = { searchPartial };
