// import { API } from './utils/constants';
// import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	const columnWidth = 400; // 400px width for each image
	const calculateGalleryCols = () => {
		const gallery = document.querySelector('.gallery');
		gallery.style.columnCount = Math.floor(document.documentElement.clientWidth / columnWidth);
	};

	const checkUserLoggedIn = () => {
		const userInfo = JSON.parse(localStorage.getItem('artisan_user'));
		if (userInfo.user_id) {
			const newElements = '<div class="nav-links"><a class="" href="/upload">Upload</a><a class="" href="/profile">Profile</a><a class="" href="/logout">Log out</a></div>';
			const appHeader = document.querySelector('#app-header');
			appHeader.removeChild(document.querySelector('.login-link'));
			appHeader.insertAdjacentHTML('afterbegin', newElements);
		}
	};

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
