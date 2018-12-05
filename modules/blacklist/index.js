'use strict';
module.exports = (opts) => {
	return opts? require('./' + opts.type)(opts) : require('./memory');
}