'use strict';

import moment from 'moment';
import { checkUserLoggedIn, initApp, normalizeFilePath } from './utils/shared-functions';
import { API } from './utils/constants';
import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	const postId = window.location.pathname.split('/')[2];
	const commentInput = document.querySelector('textarea.comment-input');

	const getPostDetails = () => {
		makeRequest(API.post.getPostById.url(postId), API.post.getPostById.method)
			.then(resData => {
				// populate post information
				document.querySelector('.light-box .image-wrapper img').setAttribute('src', normalizeFilePath(resData.path));
				document.querySelector('.information .title').innerText = resData.title;
				if (resData.avatar_path) {
					document.querySelector('.information .user-details .avatar').style.backgroundImage = `url(${ resData.avatar_path })`;
				}
				document.querySelector('.information .user-details .name').innerText = resData.fullname;
				document.querySelector('.post-details .stats .values td:nth-child(1)').innerText = moment(resData.post_time).fromNow();
				document.querySelector('.post-details .stats .values td:nth-child(2)').innerText = resData.views ? resData.views : 1;
				document.querySelector('.post-details .stats .values td:nth-child(3)').innerText = resData.likes;
				const categoriesHtml = resData.post_category.split(',').reduce((result, item) => {
					return result + `<span class="tag">${ item }</span>`;
				}, '');
				document.querySelector('.post-details .categories .tags-container').insertAdjacentHTML('afterbegin', categoriesHtml);
			});
	};

	const getComments = () => {
		makeRequest(API.post.getCommentsByPostId.url(postId), API.post.getCommentsByPostId.method)
			.then(resData => {
				const commentsSection = document.querySelector('.information .comments-section .all-comments');
				let content;
				if (resData.length) {
					while (commentsSection.lastChild) {
						commentsSection.removeChild(commentsSection.lastChild);
					}
					content = resData.reduce((result, item) => {
						return result + `<div class="comment">
						<div class="avatar"></div>
						<div class="right-side">
							<div class="name"><a href="">${ item.fullname }</a></div>
							<div class="text">${ item.content }</div>
						</div>
						<div class="time">${ moment(item.time_creatd).fromNow() }</div>
					</div>`;
					}, '');
				} else {
					content = '<div class="no-comments">It\'s quiet here. Why don\'t you say something?</div>';
				}
				commentsSection.insertAdjacentHTML('beforeend', content);
			});
	};

	const addComment = () => {
		makeRequest(API.post.commentOnPost.url(postId), API.post.commentOnPost.method, { content: commentInput.value })
			.then(resData => {
				if (resData && resData.comment_id) {
					commentInput.value = '';
					getComments();
				}
			});
	};

	initApp();
	checkUserLoggedIn(true);
	getPostDetails();
	getComments();

	commentInput.addEventListener('keydown', (e) => {
		if (e.keyCode === 13) { // user presses Enter
			e.preventDefault();
			addComment();
		}
	});
});
