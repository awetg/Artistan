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
		getUserData: {
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
	}
};
