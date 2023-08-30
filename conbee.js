const { Point } = require('@influxdata/influxdb-client');

const Conbee = ({ conbeeAPI, influx }) => {
	const supportedSensors = [
		'ZLLTemperature',
		'ZLLLightLevel',
		'ZHATemperature',
		'ZHAHumidity',
		'ZHAPressure',
		'ZHAConsumption',
		'ZHAPower',
		'ZHAOpenClose',
	];

	const valuesForStates = {
		temperature: ({ temperature }) => {
			const point = 'temperature';
			const value = temperature / 100;
			const dataType = 'float';
			return { point, value, dataType };
		},
		lightLevel: ({ lightlevel }) => {
			const point = 'lightLevel';
			const value = 10 ** ((parseInt(lightlevel, 10) - 1) / 10000);
			const dataType = 'int';
			return { point, value, dataType };
		},
		presence: ({ presence }) => {
			const point = 'presence';
			const dataType = 'bool';
			return { point, value: presence, dataType };
		},
		daylight: ({ daylight }) => {
			const point = 'daylight';
			const dataType = 'bool';
			return { point, value: daylight, dataType };
		},
		buttonEvent: ({ buttonevent }) => {
			const point = 'button';
			const dataType = 'int';
			return { point, value: buttonevent, dataType };
		},
		humidity: ({ humidity }) => {
			const point = 'humidity';
			const value = humidity / 100;
			const dataType = 'float';
			return { point, value, dataType };
		},
		pressure: ({ pressure }) => {
			const point = 'pressure';
			const dataType = 'int';
			return { point, value: pressure, dataType };
		},
		consumption: ({ consumption }) => {
			const point = 'consumption';
			const value = consumption / 1000;
			const dataType = 'float';
			return { point, value, dataType };
		},
		power: ({ power }) => {
			const point = 'power';
			const dataType = 'float';
			return { point, value: power, dataType };
		},
		open: ({ open }) => {
			const point = 'open';
			const dataType = 'bool';
			return { point, value: open, dataType };
		},
		light: ({ on }) => {
			const point = 'light';
			const dataType = 'bool';
			return { point, value: on, dataType };
		},
	};

	const sensorTypes = {
		ZLLTemperature: (state) => valuesForStates.temperature(state),
		ZHATemperature: (state) => valuesForStates.temperature(state),
		ZLLLightLevel: (state) => valuesForStates.lightLevel(state),
		ZLLPresence: (state) => valuesForStates.presence(state),
		Daylight: (state) => valuesForStates.daylight(state),
		CLIPPresence: (state) => valuesForStates.presence(state),
		ZGPSwitch: (state) => valuesForStates.buttonEvent(state),
		ZHAHumidity: (state) => valuesForStates.humidity(state),
		ZHAPressure: (state) => valuesForStates.pressure(state),
		ZHAConsumption: (state) => valuesForStates.consumption(state),
		ZHAPower: (state) => valuesForStates.power(state),
		ZHAOpenClose: (state) => valuesForStates.open(state),
	};

	const getLights = async () => {
		const lights = await conbeeAPI.getAllLights();

		const lightsFiltered = Object.entries(lights).map(([id, item]) => {
			const { name, type, state } = item;
			const { on, reachable } = state;

			return {
				id: parseInt(id, 10),
				name,
				type,
				on,
				reachable,
			};
		});

		return lightsFiltered;
	};

	const filterSensors = ([, item]) => {
		return supportedSensors.includes(item.type);
	};

	const getSensors = async () => {
		const sensors = await conbeeAPI.getAllSensors();

		const sensorFiltered = Object.entries(sensors)
			.filter(filterSensors)
			.map(([id, item]) => {
				const { name, type, state, config } = item;
				const { battery, reachable } = config;
				const values = sensorTypes[type](state);

				return {
					id: parseInt(id, 10),
					name,
					type,
					battery,
					reachable,
					...values,
				};
			});

		return sensorFiltered;
	};

	const writeLight = async () => {
		let lights;

		try {
			lights = await getLights();
		} catch (err) {
			console.error('Error getting lights', err);
			return;
		}

		lights.forEach((item) => {
			const point = new Point('light')
				.tag('device', 'conbee')
				.tag('deviceId', item.id)
				.tag('deviceName', item.name)
				.booleanField('on', item.on);
			influx.writePoint(point);
			console.log(point);
		});
	};
	const writeSensors = async () => {
		let sensors;

		try {
			sensors = await getSensors();
		} catch (err) {
			console.error('Error getting sensors', err);
			return;
		}

		sensors.forEach((item) => {
			const point = new Point(item.point)
				.tag('device', 'conbee')
				.tag('deviceId', item.id)
				.tag('deviceName', item.name);

			if (item.dataType === 'int') {
				point.intField('value', item.value);
			} else if (item.dataType === 'float') {
				point.floatField('value', item.value);
			} else if (item.dataType === 'bool') {
				point.booleanField('value', item.value);
			}

			influx.writePoint(point);
			console.log(point);
		});
	};

	return { writeLight, writeSensors };
};

module.exports = Conbee;
