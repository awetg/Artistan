export const makeRequest = (url, method, data) => {
	return fetch(url, {
		method: method || 'GET',
		headers: {
			'x-access-token': localStorage.getItem('artisan_jwt'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(response => {
		return response.json();
	});
};
