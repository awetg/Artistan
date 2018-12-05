const cache = {};

const deleteEntry = k => delete cache[k];

module.exports = {
	set: async (key, value, lifetime) => {
		if(lifetime) setTimeout(deleteEntry(key), lifetime * 1000);
		return cache[key] = value
	},
	get: async (key) => cache[key]
}