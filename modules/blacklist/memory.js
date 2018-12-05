const cache = {};

const deleteEntry = k => delete cache[k];

module.exports = (opts) => {
	const module = {};
	module.set = async (key, value, lifetime) => {
		if(lifetime) setTimeout(() => deleteEntry(key), lifetime);
		return cache[key] = value
	}
	module.get = async (key) => cache[key];
	return module;
}