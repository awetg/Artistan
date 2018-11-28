// import { API } from './utils/constants';
// import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	calculateGalleryCols();
	checkUserLoggedIn();

	document.addEventListener('scroll', () => {
		const appHeader = document.querySelector('#app-header');
		if (document.documentElement.scrollTop >= 100) {
			if (appHeader.className.indexOf(' shrink') < 0) {
				appHeader.className += ' shrink';
			}
		} else {
			appHeader.className = appHeader.className.replace(' shrink', '');
		}
	});

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
