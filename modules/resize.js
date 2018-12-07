const sharp = require('sharp');

const doResize = (pathToFile, width, newPath, next) => {
	sharp(pathToFile)
	.resize(width)
	.toFile(newPath)
	.then(result => console.log('File Resized'))
	.catch(error => console.log(error));
	next();
}


module.exports = {
	doResize: doResize,
}