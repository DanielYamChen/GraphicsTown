const path = require("path");

module.exports = {
	entry : "./12-grtown.js",
	output : {
		filename : "12-grtown-packed.js",
		path: path.resolve(__dirname, '.')
	},
	experiments: {
  		topLevelAwait: true
	}
};