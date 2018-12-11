'use strict';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols, initApp, renderPostsFeed } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	let posts;
	let isSearching = false;
	const searchInput = document.querySelector('#seach-post-input');

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

	const searchPosts = () => {
		makeRequest(API.search.searchPosts.url(searchInput.value), API.search.searchPosts.method)
			.then(resData => {
				renderPostsFeed(resData.posts);
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

	searchInput.addEventListener('keydown', (e) => {
		if (e.keyCode === 13 && e.target.value.length) { // user presses Enter
			e.preventDefault();
			searchPosts();
			isSearching = true;
		} else if (!e.target.value.length && isSearching) {
			renderPostsFeed(posts);
			isSearching = false;
		}
	});
});
