const { InfluxDB } = require('@influxdata/influxdb-client');
const config = require('./config');
const logger = require('./logger');
const ConbeeAPI = require('./conbeeAPI');
const Conbee = require('./conbee');
const HueAPI = require('./hueAPI');
const Hue = require('./hue');

const influx = new InfluxDB({
	url: config.influx.url,
	token: config.influx.token,
}).getWriteApi(config.influx.org, config.influx.bucket, 's');

const conbeeAPI = ConbeeAPI({
	config: config.conbee,
});

const conbee = Conbee({ conbeeAPI, logger, influx });

const hueAPI = HueAPI({
	config: config.hue,
});

const hue = Hue({ hueAPI, logger, influx });

const init = async () => {
	await conbee.writeLight();
	await conbee.writeSensors();
	await hue.writeLight();
	await hue.writeLightLevel();
	await hue.writeMotion();
	await hue.writeTemperature();

	influx
		.flush()
		.then(() => {
			logger.info('Data flushed');
		})
		.catch((err) => {
			logger.error('Error flushing', err);
		});
};

init();
setInterval(init, config.general.updateInterval * 1000);
