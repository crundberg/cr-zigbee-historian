const { InfluxDB } = require('@influxdata/influxdb-client');
const config = require('./config');
const ConbeeAPI = require('./conbeeAPI');
const Conbee = require('./conbee');

const influx = new InfluxDB({
	url: config.influx.url,
	token: config.influx.token,
}).getWriteApi(config.influx.org, config.influx.bucket, 's');

const conbeeAPI = ConbeeAPI({
	config: {
		auth: config.conbee.token,
	},
});

const conbee = Conbee({ conbeeAPI, influx });

const init = async () => {
	await conbee.writeLight();
	await conbee.writeSensors();
};

init();
setInterval(init, 60 * 1000);
