//名子加密
function encodeName(text) {
	if (!(typeof text === 'string')) return text;
	text = text.trim();
	var textLength = text.length;
	if (textLength <= 1) return text;

	return text.replace(/./g, function (t, idx) {
		if (textLength === 2) {
			if (idx > 0 && idx <= textLength - 1) return '*';
			else return t;
		} else {
			if (idx > 0 && idx < textLength - 1) return '*';
			else return t;
		}
	});
}

//千分位符號
function toCurrency(currency) {
	if (!(typeof currency === 'number')) return currency;
	currency = currency.toString();
	return currency.trim().replace(/\s/g, '').replace(/./g, function (char, idx, str) {
		return idx && ((str.length - idx) % 3 === 0) ? ',' + char : char;
	});
}

//手機號碼加空白
function formatPhone(phone) {
	return phone.trim().replace(/\s/g, '').replace(/(\d{4})(\d{3})(\d{3})/g, '$1 $2 $3');
}

//產生隨機(頭尾包含)
function makeRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}