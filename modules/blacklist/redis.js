'use strict';

const redis = require('redis');

module.exports = (opts) => {

	let settings = {};
	if (opts && opts.server) {
		settings.port = opts.server.port || process.env.REDIS_PORT || 11211;
		settings.host = opts.server.host || process.env.REDIS_HOST || '127.0.0.1';
	}
	const client = redis.createClient([settings]);

	const module = {};

	module.set = async(key, value, ttl) => {
		client.set(key, value, 'PX', ttl);
		return value;
	};

	module.get = async(key) => {
		return new Promise((resolve, reject) => {
			client.get(key, (error, results) => {
				error ? reject(error) : resolve(results);
			});
		});
	};

	return module;
};
