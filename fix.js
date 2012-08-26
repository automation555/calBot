String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var date = function (s) {
	var tokens = s.split(" ");
	var date = {day: 26, month: 8, year: 2012, time: "00:00"};
	var day = 6;
	var prevOff = false;
	tokens.forEach(function(token) {
		console.log("Token is: " + token);
		if(token == "OFFSET") {
			prevOff = true;
		}
		else if(prevOff) {
			prevOff = false;
			var dayReg = /^[P]\d{1,2}[D]$/;
			var monthReg = /^[P]\d{1,2}[M]$/;
			var yearReg = /^[P]\d{1,2}[Y]$/;
			if(dayReg.test(token)) {
				var offset = token.match(/\d+/);
				date.day += (parseInt(offset));
				if(date.day > 31) {
					date.day -= 31;
					date.month += 1;
				}
			}
			if(monthReg.test(token)) {
				var offset = token.match(/\d+/);
				date.month += (parseInt(offset));
				if(date.month > 12) {
					date.month -= 12;
					date.year += 1;
				}
			}
			if(yearReg.test(token)) {
				var offset = token.match(/\d+/);
				date.year += (parseInt(offset));
			}
		}
		else {
			var weekReg = /^[X]{4}[-][W,X]{3}[-]\d/;
			var yearReg = /^[X]{4}-\d{1,2}/
			if(weekReg.test(token)) {
				var toDay = parseInt(token.match(/\d+/));
				toDay -= 1;
				offset = (toDay - day + 7) % 7;
				while(offset > 0) {
					date.day += 1;
					offset -= 1;
				}
				if(date.day > 31) {
					date.day -= 31;
					date.month += 1;
				}
				if(token.contains("T")) {
					date.time = token.match(/[T]\d{2}[:]\d{2}/);
				}
			}
			if(yearReg.test(token)) {
				var toMonth = parseInt(token.match(/\d+/));
				date.month = toMonth;
				if(token.contains("T")) {
					date.time = token.match(/[T]\d{2}[:]\d{2}/);
				}
			}
		}
		var dateObj = new Date(date.year, date.month, date.day);
		day = dateObj.getDay();
	});
	return date;
};

exports.date = date;
