const axios = require('axios').default;
const https = require('https');

const httpsAgent = new https.Agent({
	rejectUnauthorized: false, // TODO: Fix certificate
});

const HueAPI = ({ config }) => {
	const { host, token } = config;
	const instance = axios.create({
		baseURL: `https://${host}/clip/v2/resource`,
		httpsAgent,
		headers: {
			'hue-application-key': token,
		},
	});

	const getAllLights = async () => {
		const result = await instance.get('/light');
		return result.data;
	};

	const getLightLevel = async () => {
		const result = await instance.get('/light_level');
		return result.data;
	};

	const getMotion = async () => {
		const result = await instance.get('/motion');
		return result.data;
	};

	const getTemperature = async () => {
		const result = await instance.get('/temperature');
		return result.data;
	};

	return { getAllLights, getLightLevel, getMotion, getTemperature };
};

module.exports = HueAPI;
