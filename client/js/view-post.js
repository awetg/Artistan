'use strict';

import moment from 'moment';
import { checkUserLoggedIn, initApp, normalizeFilePath } from './utils/shared-functions';
import { API } from './utils/constants';
import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	let postDetails;
	const postId = window.location.pathname.split('/')[2];
	const commentInput = document.querySelector('textarea.comment-input');
	const likeButton = document.querySelector('.light-box .actions .like');
	const flagButton = document.querySelector('.light-box .actions .flag');

	const getPostDetails = () => {
		makeRequest(API.post.getPostById.url(postId), API.post.getPostById.method)
			.then(resData => {
				postDetails = resData;
				// populate post information
				document.querySelector('.light-box .image-wrapper img').setAttribute('src', normalizeFilePath(resData.path));
				document.querySelector('.information .title').innerText = resData.title;
				if (resData.avatar_path) {
					document.querySelector('.information .user-details .avatar').style.backgroundImage = `url(${ normalizeFilePath(resData.avatar_path) })`;
				}
				document.querySelector('.information .user-details .name').innerText = resData.fullname;
				document.querySelector('.post-details .stats .values td:nth-child(1)').innerText = moment(resData.post_time).fromNow();
				document.querySelector('.post-details .stats .values td:nth-child(2)').innerText = resData.views;
				document.querySelector('.post-details .stats .values td:nth-child(3)').innerText = resData.likes;
				const categoriesHtml = resData.post_category.split(',').reduce((result, item) => {
					return result + `<span class="tag">${ item }</span>`;
				}, '');
				document.querySelector('.post-details .categories .tags-container').insertAdjacentHTML('afterbegin', categoriesHtml);
				if (resData.liked) {
					likeButton.classList.add('liked');
					likeButton.setAttribute('title', 'You liked this post.');
				}
				if (resData.flagged) {
					flagButton.classList.add('flagged');
					flagButton.setAttribute('title', 'You already flagged this post.');
				}
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
						<div class="avatar" ${ item.avatar_path ? 'style="background-image: url(' + normalizeFilePath(item.avatar_path) + ')"' : '' }></div>
						<div class="right-side">
							<div class="name"><span>${ item.fullname }</span></div>
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
			.then(async(resData) => {
				if (resData && resData.comment_id) {
					commentInput.value = '';
					await getComments();
				}
			});
	};

	const likePost = () => {
		if (!postDetails.liked) { // user hasn't liked this post
			likeButton.classList.add('liked');
			makeRequest(API.post.likePost.url(postId), API.post.likePost.method)
				.then(resData => {
					if (!resData.message || resData.message !== 'Posted liked') {
						likeButton.className = likeButton.classList.remove('liked');
					} else {
						likeButton.setAttribute('title', 'You liked this post.');
					}
				})
				.catch(error => {
					console.log(error);
					likeButton.className = likeButton.classList.remove('liked');
				});
		} else { // user already liked this post, now he unlikes it
			likeButton.className = likeButton.classList.remove('liked');
			makeRequest(API.post.unlikePost.url(postId), API.post.unlikePost.method)
				.then(resData => {
					if (!resData.message || resData.message !== 'Posted unliked.') {
						likeButton.classList.add('liked');
					}
				})
				.catch(error => {
					console.log(error);
					likeButton.classList.add('liked');
				});
		}
	};

	const flagPost = () => {
		if (!postDetails.flagged) { // user can only flag a post ONCE until it's unflagged by admin
			flagButton.classList.add('flagged');
			makeRequest(API.post.flagPost.url(postId), API.post.flagPost.method)
				.then(resData => {
					if (!resData.message || resData.message !== 'Posted flagged') {
						flagButton.className = flagButton.classList.remove('flagged');
					} else {
						flagButton.setAttribute('title', 'You already flagged this post.');
					}
				})
				.catch(error => {
					console.log(error);
					flagButton.className = flagButton.classList.remove('flagged');
				});
		}
	};

	// initiation after page load
	initApp();
	checkUserLoggedIn();
	getPostDetails();
	getComments();

	// register events
	commentInput.addEventListener('keydown', (e) => {
		if (e.keyCode === 13) { // user presses Enter
			e.preventDefault();
			addComment();
		}
	});
	likeButton.addEventListener('click', likePost);
	flagButton.addEventListener('click', flagPost);
});
