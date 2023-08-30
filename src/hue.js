const { Point } = require('@influxdata/influxdb-client');

const Hue = ({ hueAPI, logger, influx }) => {
	const getLights = async () => {
		const lights = await hueAPI.getAllLights();

		const lightsFiltered = lights.data.map((item) => {
			const {
				id,
				metadata: { name },
				on: { on },
				dimming: { brightness },
				type,
			} = item;

			return {
				id,
				name,
				on,
				brightness,
				type,
			};
		});

		return lightsFiltered;
	};

	const getLightLevel = async () => {
		const sensor = await hueAPI.getLightLevel();

		const sensorFiltered = sensor.data.map((item) => {
			const { id, light, type } = item;

			const lux = 10 ** ((parseInt(light.light_level, 10) - 1) / 10000);
			const value = Math.round(lux);

			return {
				id,
				value,
				valid: light.light_level_valid,
				type,
			};
		});

		return sensorFiltered;
	};

	const getMotion = async () => {
		const sensor = await hueAPI.getMotion();

		const sensorFiltered = sensor.data.map((item) => {
			const { id, motion, type } = item;

			return {
				id,
				value: motion.motion,
				valid: motion.motion_valid,
				type,
			};
		});

		return sensorFiltered;
	};

	const getTemperature = async () => {
		const sensor = await hueAPI.getTemperature();

		const sensorFiltered = sensor.data.map((item) => {
			const { id, temperature, type } = item;

			return {
				id,
				value: temperature.temperature,
				valid: temperature.temperature_valid,
				type,
			};
		});

		return sensorFiltered;
	};

	const writeLight = async () => {
		let lights;

		try {
			lights = await getLights();
		} catch (err) {
			logger.error('Error getting lights', err);
			return;
		}

		lights.forEach((item) => {
			const point = new Point('light')
				.tag('device', 'hue')
				.tag('deviceId', item.id)
				.tag('deviceName', item.name)
				.booleanField('on', item.on);

			influx.writePoint(point);
			logger.debug(point);
		});
	};

	const writeLightLevel = async () => {
		let sensor;

		try {
			sensor = await getLightLevel();
		} catch (err) {
			logger.error('Error getting light level', err);
			return;
		}

		sensor.forEach((item) => {
			const point = new Point('lightlevel')
				.tag('device', 'hue')
				.tag('deviceId', item.id)
				.intField('value', item.value);

			influx.writePoint(point);
			logger.debug(point);
		});
	};

	const writeMotion = async () => {
		let sensor;

		try {
			sensor = await getMotion();
		} catch (err) {
			logger.error('Error getting motion', err);
			return;
		}

		sensor.forEach((item) => {
			const point = new Point('motion')
				.tag('device', 'hue')
				.tag('deviceId', item.id)
				.booleanField('value', item.value);

			influx.writePoint(point);
			logger.debug(point);
		});
	};

	const writeTemperature = async () => {
		let sensor;

		try {
			sensor = await getTemperature();
		} catch (err) {
			logger.error('Error getting temperature', err);
			return;
		}

		sensor.forEach((item) => {
			const point = new Point('temperature')
				.tag('device', 'hue')
				.tag('deviceId', item.id)
				.floatField('value', item.value);

			influx.writePoint(point);
			logger.debug(point);
		});
	};

	return {
		getLights,
		getLightLevel,
		getMotion,
		getTemperature,
		writeLight,
		writeLightLevel,
		writeMotion,
		writeTemperature,
	};
};

module.exports = Hue;
