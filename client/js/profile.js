'use strict';

import moment from 'moment';

import { API } from './utils/constants';
import { makeRequest } from './utils/network';
import { calculateGalleryCols, fetchAvatar, renderPostsFeed, checkUserLoggedIn, normalizeFilePath } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	checkUserLoggedIn(true);
	const fileInput = document.querySelector('#file-input');
	const changeAvatarButton = document.querySelector('button.change-avatar');
	const userId = JSON.parse(localStorage.getItem('artisan_user')).user_id;
	const collectionID = '540518';

	const fetchMyInfo = () => {
		makeRequest(API.users.getUserById.url(userId), API.users.getUserById.method)
			.then(resData => {
				document.querySelector('.my-info .fullname').innerText = resData.fullname;
				document.querySelector('.my-info .numbers .left').insertAdjacentHTML('afterbegin', `
					<span>${ resData.total_posts } posts</span>
					<span>${ resData.likes } likes</span>
				`);
				document.querySelector('.my-info .numbers .right').insertAdjacentHTML('afterbegin', `
					<span>Member since: ${ moment(resData.time_created).format('DD-MM-YYYY') }</span>
				`);
			});
	};

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
					if (resData.avatar_path) {
						const filePath = normalizeFilePath(resData.avatar_path);
						document.querySelector('#profile-page .my-info .avatar').style.backgroundImage = `url(${ filePath })`;
					}
				})
				.catch((error) => {
					console.log(error);
				// handleServerError(error.message);
				});
		}
	};

	fetchAvatar(userId)
		.then(resData => {
			if (resData[0]) {
				const filePath = normalizeFilePath(resData[0].path);
				document.querySelector('#profile-page .my-info .avatar').style.backgroundImage = `url(${ filePath })`;
			}
		});

	// get random photo as cover photo
	fetch(`https://source.unsplash.com/collection/${collectionID}/1920x1080/`)
		.then(response => {
			document.querySelector('#profile-page .my-info .cover-photo').style.backgroundImage = `url(${ response.url })`;
		});

	fetchMyInfo();
	fetchMyPosts();

	changeAvatarButton.addEventListener('click', e => {
		e.preventDefault();
		fileInput.click();
	});

	fileInput.addEventListener('change', uploadAvatar);
});
