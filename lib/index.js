const COLORSTROLOGY = "https://www.pantone.com/colorstrology";

var request = require('request')
var DOMParser = require('dom-parser');

function ColorOfTheDay() {

	request(COLORSTROLOGY, function (error, response, body) {

		if (response && response.statusCode == 200) {

			var doc = new DOMParser().parseFromString(body, "text/html");
			var spans = doc.getElementsByTagName("span");

			// TODO Perfezionare e prendere il valore
			for (i = 0; i < spans.length; i++) {
				if (spans[i].getAttribute("class") === "colorBG") {
					var color = spans[i].getAttribute("style");
					console.log(formatHex(color));
					break;
				}
			}

		} else {
			console.log("Error...");
		}

	});

}

function formatHex(c) {
	return c.substring(6).substring(0, 7);
}

module.exports = ColorOfTheDay;