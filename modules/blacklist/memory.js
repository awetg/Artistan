const cache = {};

module.exports = (opts) => {
	const module = {};
	module.set = async(key, value, ttl) => {
		if (ttl) {
			setTimeout(() => deleteEntry(key), ttl);
		}
		cache[key] = value;
		return value;
	};

	module.get = async(key) => cache[key];

	module.deleteEntry = async(key) => delete cache[key];
	return module;
};
