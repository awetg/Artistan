'use strict';

const sharp = require('sharp');

const resize = (pathToFile, width, newPath, next) => {
	sharp(pathToFile)
		.resize(width)
		.toFile(newPath)
		.catch(error => console.log(error));
	next();
};

module.exports = resize;
