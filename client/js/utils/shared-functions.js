'use strict';

import justifiedLayout from 'justified-layout';

import { makeRequest } from './network';
import { API } from './constants';

const userInfo = JSON.parse(localStorage.getItem('artisan_user'));
export const checkUserLoggedIn = (isPrivatePage) => {
	if (userInfo && userInfo.user_id) {
		makeRequest(API.users.checkAuth.url(userInfo.user_id), API.users.checkAuth.method)
			.then(response => {
				if (response.error) {
					localStorage.removeItem('artisan_user');
					localStorage.removeItem('artisan_jwt');
					window.location.href = '/login';
				} else if (response[0].user_id) {
					const newElements = '<a class="" href="/upload">Share your art</a><a class="" href="/profile">Profile</a><a class="" href="/logout">Log out</a>';
					const navLinks = document.querySelector('.nav-links');
					const loginLink = document.querySelector('.login-link');
					if (loginLink) {
						navLinks.removeChild(loginLink);
						navLinks.insertAdjacentHTML('afterbegin', newElements);
					}
				}
			});
	} else {
		if (isPrivatePage) {
			window.location.href = '/login';
		}
	}
};

const columnWidth = 400; // 400px width for each image
export const calculateGalleryCols = () => {
	const gallery = document.querySelector('.gallery');
	gallery.style.columnCount = Math.floor(document.documentElement.clientWidth / columnWidth);
};

export const initApp = async() => {
	// get categories
	return await makeRequest(API.category.getAllCategories.url, API.category.getAllCategories.method)
		.then(resData => {
			if (resData && resData.length) {
				localStorage.setItem('categories', JSON.stringify(resData));
			}
		});
};

export const fetchAvatar = async(user_id) => {
	return await makeRequest(API.users.getAvatar.url(user_id), API.users.getAvatar.method);
};

export const renderPostsFeed = (posts) => {
	const ratios = posts.map(post => parseFloat(post.image_ratio));
	const layout = justifiedLayout(ratios, {
		containerWidth: document.querySelector('.gallery').clientWidth,
		boxSpacing: 10
	});
	const template = posts.reduce((result, post, index) => {
		const box = layout.boxes[index];
		return result + `<figure class="item" data-id="${ post.post_id }" style="top: ${ box.top }px; width: ${ box.width }px; height: ${ box.height }px; left: ${ box.left }px;">
		<img src="${ normalizeFilePath(post.path) }" />
		<figcaption class="title">
			<div>${ post.title }</div>
			<div><small>by</small> <b>${ post.fullname }</b></div>
		</figcaption>
	</figure>`;
	}, '');
	document.querySelector('.gallery').insertAdjacentHTML('beforeend', template);
	registerPostClickEvent();
};

const registerPostClickEvent = () => {
	document.querySelectorAll('.gallery figure.item').forEach(item => {
		item.addEventListener('click', () => {
			const itemId = item.getAttribute('data-id');
			window.location.href = `/post/${ itemId }`;
		});
	});
};

export const normalizeFilePath = (path) => {
	let result = path.replace(/\\/g, '/');
	if (path[0] !== '/') {
		result = '/' + result;
	}
	return result;
};
