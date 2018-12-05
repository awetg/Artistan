'use strict';

const STORE_TYPE = ['memory', 'redis', 'memcached'];

module.exports = (opts) => {
	return opts? require('./' + opts.type)(opts) : require('./memory')(opts);
}