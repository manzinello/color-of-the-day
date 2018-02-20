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

const DIVIDER = "-----";
const HASHTAG = "#";
const COLOR_HEXA = "http://www.colorhexa.com/";
const COLOR_ERROR = "Error...";
const FACEBOOK = "color-of-the-day on Facebook: https://www.facebook.com/pantonecoloroftheday";
const THANKS = "thanks to https://www.pantone.com/colorstrology";

function color() {

	var date = null;
	var todayColor = null;
	var todayColorHex = null;

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

			if (date && todayColor && todayColorHex && todayColorHex.length === 7 && todayColorHex.substring(0, 1) === HASHTAG) {
				printColor(date, todayColor, todayColorHex);
			} else {
				console.log(COLOR_ERROR);
			}

		} else {
			console.log(COLOR_ERROR);
		}

	});

}

function formatHex(c) {
	return c.substring(6).substring(0, 7);
}

function printColor(date, todayColor, todayColorHex) {
	console.log(DIVIDER);
	console.log(date);
	console.log(todayColor);
	console.log(todayColorHex)
	console.log(createUrl(todayColorHex));
	console.log(FACEBOOK);
	console.log(THANKS);
	console.log(DIVIDER);
}

function createUrl(todayColorHex) {
	return COLOR_HEXA + todayColorHex.substring(1).toLowerCase();
}

module.exports.color = color;