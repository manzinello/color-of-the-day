var request = require('request')
var DOMParser = require('dom-parser');

const COLORSTROLOGY = "https://www.pantone.com/colorstrology";
const HTML = "text/html";

const DOM_SECTION = "section";
const DOM_CLASS = "class";
const DOM_TITLE = "title";
const DOM_DIV = "div";
const DOM_SPAN = "span";
const DOM_STYLE = "style";
const DOM_STRONG = "strong";
const COLOR_RESULT = "colorResult";
const COLOR_BG = "colorBG";
const SWATCH_INNER = "swatch inner";

function ColorOfTheDay() {

	var todayColor = null;
	var todayColorHex = null;

	request(COLORSTROLOGY, function (error, response, body) {

		if (response && response.statusCode == 200) {

			var doc = new DOMParser().parseFromString(body, HTML);
			var sections = doc.getElementsByTagName(DOM_SECTION);
			var s;
			for (i = 0; i < sections.length; i++) {
				if (sections[i].getAttribute(DOM_CLASS) === COLOR_RESULT) {
					s = sections[i];
					break;
				}
			}

			{

				var divs = s.getElementsByTagName(DOM_DIV);
				for (i = 0; i < divs.length; i++) {
					if (divs[i].getAttribute(DOM_CLASS) === SWATCH_INNER) {
						todayColor = divs[i].getAttribute(DOM_TITLE);
					}
				}

				var spans = s.getElementsByTagName(DOM_SPAN);
				for (i = 0; i < spans.length; i++) {
					if (spans[i].getAttribute(DOM_CLASS) === COLOR_BG) {
						todayColorHex = formatHex(spans[i].getAttribute(DOM_STYLE));
						break;
					}
				}

			}

			if (todayColor && todayColorHex) {
				printColor(todayColor, todayColorHex);
			} else {
				console.log("Error");
			}

		} else {
			console.log("Error...");
		}

	});

}

function ObjectColorOfTheDay() {

	var todayColor = null;
	var todayColorHex = null;
	var date = null;

	request(COLORSTROLOGY, function (error, response, body) {

		if (response && response.statusCode == 200) {

			var doc = new DOMParser().parseFromString(body, HTML);
			var sections = doc.getElementsByTagName(DOM_SECTION);
			var s, span;
			for (i = 0; i < sections.length; i++) {
				if (sections[i].getAttribute(DOM_CLASS) === COLOR_RESULT) {
					s = sections[i];
					break;
				}
			}

			{

				var divs = s.getElementsByTagName(DOM_DIV);
				for (i = 0; i < divs.length; i++) {
					if (divs[i].getAttribute(DOM_CLASS) === SWATCH_INNER) {
						todayColor = divs[i].getAttribute(DOM_TITLE);
					}
				}

				var spans = s.getElementsByTagName(DOM_SPAN);
				for (i = 0; i < spans.length; i++) {
					if (spans[i].getAttribute(DOM_CLASS) === COLOR_BG) {
						span = spans[i];
						todayColorHex = formatHex(spans[i].getAttribute(DOM_STYLE));
						break;
					}
				}

				var strongs = span.getElementsByTagName(DOM_STRONG);
				date = strongs[0].textContent;

			}

			if (todayColor && todayColorHex) {

				var o = {
					date: date,
					title: todayColor,
					hex: todayColorHex,
					hexnohash: todayColorHex.substring(1)
				}

				console.log(o);

			} else {
				console.log("Error");
			}

		}

	});

}

function formatHex(c) {
	return c.substring(6).substring(0, 7);
}

function printColor(todayColor, todayColorHex) {
	console.log(todayColor + "\n" + todayColorHex);
}

// Module exports
module.exports.color = ColorOfTheDay;
module.exports.object = ObjectColorOfTheDay;