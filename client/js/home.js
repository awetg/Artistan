'use strict';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols, initApp, renderPostsFeed } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	const fetchPosts = () => {
		makeRequest(API.post.getAllPosts.url, API.post.getAllPosts.method)
			.then(resData => {
				renderPostsFeed(resData);
				calculateGalleryCols();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	initApp();
	checkUserLoggedIn();
	fetchPosts();

	window.addEventListener('resize', () => {
		calculateGalleryCols();
	});
});
