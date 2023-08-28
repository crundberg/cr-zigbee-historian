require('dotenv').config();

module.exports = {
	conbee: {
		token: process.env.conbeeToken,
	},
	influx: {
		url: process.env.influxUrl,
		token: process.env.influxToken,
		org: process.env.influxOrg,
		bucket: process.env.influxBucket,
	},
};
