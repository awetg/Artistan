'use strict';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { calculateGalleryCols, fetchAvatar, renderPostsFeed, checkUserLoggedIn } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	checkUserLoggedIn(true);
	const fileInput = document.querySelector('#file-input');
	const changeAvatarButton = document.querySelector('button.change-avatar');
	const changeCoverButton = document.querySelector('button.change-cover');
	const userId = JSON.parse(localStorage.getItem('artisan_user')).user_id;
	const collectionID = '540518';

	const fetchMyPosts = () => {
		makeRequest(API.post.getPostByUser.url(userId), API.post.getPostByUser.method)
			.then(resData => {
				renderPostsFeed(resData);
				calculateGalleryCols();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const uploadAvatar = (e) => {
		const file = e.currentTarget.files[0];
		if (!file || !file.type.match(/image.*/)) {
			return;
		} else {
			const data = new FormData(document.querySelector('form'));
			makeRequest(API.users.uploadAvatar.url(userId), API.users.uploadAvatar.method, data, true)
				.then(resData => {
					console.log(resData);
				})
				.catch((error) => {
					console.log(error);
				// handleServerError(error.message);
				});
		}
	};

	fetchAvatar(userId)
		.then(resData => {
			const filePath = resData[0].path.replace(/\\/g, '/');
			document.querySelector('#profile-page .my-info .avatar').style.backgroundImage = `url(${ filePath })`;
		});

	// get random photo as cover photo
	fetch(`https://source.unsplash.com/collection/${collectionID}/1920x1080/`)
		.then(response => {
			document.querySelector('#profile-page .my-info .cover-photo').style.backgroundImage = `url(${ response.url })`;
		});

	fetchMyPosts();

	changeAvatarButton.addEventListener('click', e => {
		e.preventDefault();
		fileInput.click();
	});

	changeCoverButton.addEventListener('click', e => {
		e.preventDefault();
		fileInput.click();
	});

	fileInput.addEventListener('change', uploadAvatar);
});
