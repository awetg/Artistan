// import { API } from './utils/constants';
// import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
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
