export const BASE_API_URL = '/api';
export const API = {
	users: {
		register: {
			url: BASE_API_URL + '/users',
			method: 'POST'
		},
		login: {
			url: BASE_API_URL + '/users/login',
			method: 'POST'
		},
		getUserData: {
			url: user_id => BASE_API_URL + `/users/${user_id}`,
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
	}
};
