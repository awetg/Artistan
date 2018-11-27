import { API } from './utils/constants';
import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	const columnWidth = 400; // 400px width for each image
	const calculateGalleryCols = () => {
		const gallery = document.querySelector('.gallery');
		gallery.style.columnCount = Math.floor(document.documentElement.clientWidth / columnWidth);
	};

	const getUserInfo = () => {
		let userInfo = JSON.parse(localStorage.getItem('artisan_user'));
		makeRequest(API.users.getUserData.url(userInfo.user_id), API.users.getUserData.method)
			.then(response => response.json())
			.then(result => {
				if (result.user_id) {
					localStorage.setItem('artisan_user', JSON.stringify(result));
				}
				// get the latest user info
				userInfo = JSON.parse(localStorage.getItem('artisan_user'));
				const userInfoElement = `<div class="user-info">Hi ${userInfo.fullname}</div>`;
				const appHeader = document.querySelector('#app-header');
				appHeader.removeChild(document.querySelector('.login-link'));
				appHeader.insertAdjacentHTML('afterbegin', userInfoElement);
			});
	};

	calculateGalleryCols();
	getUserInfo();

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
