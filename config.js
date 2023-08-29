require('dotenv').config();

module.exports = {
	conbee: {
		host: process.env.conbeeHost,
		token: process.env.conbeeToken,
	},
	hue: {
		host: process.env.hueHost,
		token: process.env.hueToken,
	},
	influx: {
		url: process.env.influxUrl,
		token: process.env.influxToken,
		org: process.env.influxOrg,
		bucket: process.env.influxBucket,
	},
};
