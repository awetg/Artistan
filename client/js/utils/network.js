'use strict';

export const makeRequest = (url, method, data, isUpload) => {
	const headers = {
		'x-access-token': localStorage.getItem('artisan_jwt'),
		'Content-Type': 'application/json'
	};
	if (isUpload) {
		delete headers['Content-Type'];
	}
	return fetch(url, {
		method: method || 'GET',
		headers,
		body: isUpload ? data : JSON.stringify(data)
	}).then(response => {
		return response.json();
	});
};
