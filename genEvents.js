var ltx = require('ltx');
var argv = process.argv;
var fs = require('fs');
var fix = require('./fix');

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

if(argv.length != 3) {
	console.error('File not specified properly');
}

fs.readFile(argv[2], 'ascii', function(err, data) {
	if(err) {
		console.error('Error in reading file: %s', err);
		process.exit(1);
	}
	var body = ltx.parse(data);
	genEvent(body);
});

function genEvent(body) {
	body = body.getChild("document").getChild("sentences");
	var sentences = body.getChildren("sentence");
	sentences.forEach(function(text) {
		text = text.getChild("tokens");
		var tokens = text.getChildren("token");
		var date, time, locale;
		var title = {};
		tokens.forEach(function(token) {
			if(token.getChildText("NER") == "DATE") {
				date = fix.date(token.getChildText("NormalizedNER"));
			}
			if(token.getChildText("NER") == "TIME") {
				time = token.getChildText("NormalizedNER");
			}
			if(token.getChildText("NER") == "LOCATION") {
				locale = token.getChildText("word");
			}
			/*if(token.getChildText("POS").contains("NN")) {
				title[token.getChildText("word")] = 1;
			}*/
		});
		text = text.up().getChild("basic-dependencies");
		var deps = text.getChildren("dep");
		deps.forEach(function(dep) {
			if(dep.attrs["type"] == "poss") {
				title[dep.getChildText("governor")] = 1;
				title[dep.getChildText("dependent")] = 1;
			}
			if(dep.attrs["type"] == "nsubj") {
				title[dep.getChildText("dependent")] = 1;
			}
			if(dep.attrs["type"] == "nn") {
				title[dep.getChildText("governor")] = 1;
				title[dep.getChildText("dependent")] = 1;
			}
		});
		console.log("DATE " + JSON.stringify(date));
		console.log("Time" + time);
		console.log("Location is: " + locale);
		for(key in title) {
			console.log("Key words are: " + key);
		}
	});
}
