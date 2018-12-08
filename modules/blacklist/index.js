/* Returns the correct caching module dependig upon passed options object if no options passed memory is used*/
'use strict';

const STORE_TYPE = ['memory', 'redis', 'memcached'];

module.exports = opts => (opts && STORE_TYPE.includes(opts.type)) ? require('./' + opts.type)(opts) : require('./memory')(opts);
