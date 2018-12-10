'use strict';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { checkUserLoggedIn, initApp } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	checkUserLoggedIn(true);

	const galleryFlagged = document.querySelector('.gallery_flagged');

	const deletePost = postId => {
		makeRequest(API.admin.deletePost.url(postId), API.admin.deletePost.method)
			.then(resData => console.log(resData))
			.catch(error => console.log(error));
	};

	const delteAllFags = postId => {
		makeRequest(API.admin.delteAllFags.url(postId), API.admin.delteAllFags.method)
			.then(resData => console.log(resData))
			.catch(error => console.log(error));
	};

	const registerListner = () => {
		const galleryItems = document.querySelectorAll('.gallery_flagged .gallery_item');
		galleryItems.forEach(item => {
			item.addEventListener('click', event => {
				event.stopPropagation();
				const butttonName = event.target.innerText;
				const postId = event.target.getAttribute('data-id');
				if (butttonName === 'delete') {
					event.target.closest('.gallery_item').remove();
					deletePost(postId);
				} else if (butttonName === 'unflag') {
					event.target.closest('.gallery_item').remove();
					delteAllFags(postId);
				}
			});
		});
	};

	const renderFlaggedPost = (posts) => {
		const template = posts.map(post => {
			return `
	        <div class="gallery_item">
        		<img src="${post.path}">
        		<div class="item_details">
        			<div class="details_box">
        				<p class="details_keys">Flags</p>
        				<p>${post.flags}</p>
        			</div>
        			<div class="details_box">
        				<p class="details_keys">Views</p>
        				<p>${post.views}</p>
        			</div>
        			<div class="details_box">
        				<p class="details_keys">Likes</p>
        				<p>${post.likes}</p>
        			</div>
		            <diV>
		              <button class="details_btn btn--danger" data-id="${post.post_id}">delete</button>
		              <button class="details_btn btn--primary" data-id="${post.post_id}">unflag</button>
		            </diV>
        		</div>
        	</div>`;
		});
		galleryFlagged.innerHTML = template.join('');
		registerListner();
	};

	const fetchPosts = () => {
		makeRequest(API.admin.getFlaggedPosts.url, API.admin.getFlaggedPosts.method)
			.then(posts => {
				if (posts.length > 0) {
					renderFlaggedPost(posts);
				} else {
					galleryFlagged.style.color = 'green';
					galleryFlagged.innerText = 'There are no flagged post.';
				}
			})
			.catch((error) => console.log(error));
	};

	initApp();
	fetchPosts();
});
