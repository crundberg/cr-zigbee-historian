require('dotenv').config();

module.exports = {
	general: {
		updateInterval: parseInt(process.env.updateInterval, 10) || 60,
	},
	conbee: {
		host: process.env.conbeeHost,
		token: process.env.conbeeToken,
	},
	hue: {
		host: process.env.hueHost,
		token: process.env.hueToken,
	},
	log: {
		level: process.env.logLevel || 'info',
	},
	influx: {
		url: process.env.influxUrl,
		token: process.env.influxToken,
		org: process.env.influxOrg,
		bucket: process.env.influxBucket,
	},
};
