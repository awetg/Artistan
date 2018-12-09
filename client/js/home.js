'use strict';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols, initApp, renderPostsFeed } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	let posts;
	const fetchPosts = () => {
		makeRequest(API.post.getAllPosts.url, API.post.getAllPosts.method)
			.then(resData => {
				posts = resData;
				renderPostsFeed(posts);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	initApp();
	checkUserLoggedIn();
	fetchPosts();

	window.addEventListener('resize', () => {
		renderPostsFeed(posts);
	});
});
