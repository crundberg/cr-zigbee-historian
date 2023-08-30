const { createLogger, format, transports } = require('winston');
const config = require('./config');

const formatConsole = format.combine(
	format.errors({ stack: true }),
	format.align(),
	format.colorize(),
	format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss',
	}),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const { level } = config.log;

const consoleTransport = new transports.Console({
	format: formatConsole,
	handleExceptions: true,
	handleRejections: true,
});

const logger = createLogger({
	level,
	transports: [consoleTransport],
});

module.exports = logger;
