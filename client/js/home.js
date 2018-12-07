'use strict';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { checkUserLoggedIn, calculateGalleryCols, initApp } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	const renderPostsFeed = (posts) => {
		const template = posts.reduce((result, post) => {
			return result + `<figure class="item" data-id="${ post.post_id }">
			<img src="/uploads/${ post.filename }" />
			<figcaption class="title">
				<div>${ post.title }</div>
				<div>by <b>${ post.fullname }</b></div>
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
