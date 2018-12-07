'use strict';

// import { API } from './utils/constants';
// import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols, initApp } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	initApp();
	calculateGalleryCols();
	checkUserLoggedIn();

	document.querySelector('.gallery').addEventListener('click', (e) => {
		if (e.target !== e.currentTarget) {
			console.log('click');
			e.stopPropagation();
		}
	});

	window.addEventListener('resize', () => {
		calculateGalleryCols();
	});
});
