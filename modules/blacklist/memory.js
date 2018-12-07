const cache = {};

module.exports = (opts) => {
	const module = {};
	module.set = async (key, value, ttl) => {
		if(ttl) setTimeout(() => delete(key), ttl);
		return cache[key] = value
	}

	module.get = async (key) => cache[key];

	module.delete = async (key) => delete cache[key];
	return module;
}