'use strict';

export const BASE_API_URL = '/api';
export const API = {
	users: {
		register: {
			url: BASE_API_URL + '/auth/register',
			method: 'POST'
		},
		login: {
			url: BASE_API_URL + '/auth/login',
			method: 'POST'
		},
		logout: {
			url: BASE_API_URL + '/auth/logout',
			method: 'POST'
		},
		checkAuth: {
			url: user_id => BASE_API_URL + `/auth/${user_id}`,
			method: 'GET'
		},
		updateUser: {
			url: user_id => BASE_API_URL + `/auth/${user_id}`,
			method: 'PATCH'
		},
		deleteUser: {
			url: user_id => BASE_API_URL + `/auth/${user_id}`,
			method: 'DELETE'
		},
		uploadAvatar: {
			url: user_id => BASE_API_URL + `/users/${ user_id }/avatar`,
			method: 'POST'
		},
		getAvatar: {
			url: user_id => BASE_API_URL + `/users/${ user_id }/avatar`,
			method: 'GET'
		},
		getUserById: {
			url: user_id => BASE_API_URL + `/users/${ user_id }`,
			method: 'GET'
		}
	},
	media: {
		getAllFiles: {
			url: BASE_API_URL + '/media',
			method: 'GET'
		},
		uploadFile: {
			url: BASE_API_URL + '/media',
			method: 'POST'
		},
		getFilesByUser: {
			url: BASE_API_URL + '/media/user',
			method: 'GET'
		},
		getFileById: {
			url: file_id => BASE_API_URL + `/media/${file_id}`,
			method: 'GET'
		},
		updateFile: {
			url: file_id => BASE_API_URL + `/media/${file_id}`,
			method: 'PATCH'
		},
		deleteFile: {
			url: file_id => BASE_API_URL + `/media/${file_id}`,
			method: 'DELETE'
		}
	},
	category: {
		getAllCategories: {
			url: BASE_API_URL + '/category',
			method: 'GET'
		}
	},
	post: {
		getAllPosts: {
			url: BASE_API_URL + '/post',
			method: 'GET'
		},
		createPost: {
			url: BASE_API_URL + '/post',
			method: 'POST'
		},
		likePost: {
			url: post_id => `${ BASE_API_URL }/post/${ post_id }/like`,
			method: 'POST'
		},
		unlikePost: {
			url: post_id => `${ BASE_API_URL }/post/${ post_id }/like`,
			method: 'DELETE'
		},
		flagPost: {
			url: post_id => `${ BASE_API_URL }/post/${ post_id }/flag`,
			method: 'POST'
		},
		unflagPost: {
			url: post_id => `${ BASE_API_URL }/post/${ post_id }/flag`,
			method: 'DELETE'
		},
		getPostByUser: {
			url: user_id => `${ BASE_API_URL }/post/${ user_id }/user`,
			method: 'GET'
		},
		getPostById: {
			url: post_id => `${ BASE_API_URL }/post/${ post_id }`,
			method: 'GET'
		},
		getCommentsByPostId: {
			url: post_id => `${ BASE_API_URL }/comment/${ post_id }`,
			method: 'GET'
		},
		commentOnPost: {
			url: post_id => `${ BASE_API_URL }/comment/${ post_id }`,
			method: 'POST'
		}
	}
};
