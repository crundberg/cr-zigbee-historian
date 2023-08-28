const axios = require('axios').default;

const ConbeeAPI = ({ config }) => {
	const { auth } = config;
	const instance = axios.create({
		baseURL: `http://zigbee.kube.crundberg.se/api/${auth}`,
	});

	const getAllLights = async () => {
		const result = await instance.get('/lights');
		return result.data;
	};

	const getAllSensors = async () => {
		const result = await instance.get('/sensors');
		return result.data;
	};

	return { getAllLights, getAllSensors };
};

module.exports = ConbeeAPI;
