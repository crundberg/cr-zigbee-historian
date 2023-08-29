const { Point } = require('@influxdata/influxdb-client');

const Hue = ({ hueAPI, influx }) => {
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

			return {
				id,
				value: light.light_level,
				valid: light.light_level_valid,
				type,
			};
		});

		return sensorFiltered;
	};

	return { getLights, getLightLevel };
};

module.exports = Hue;
