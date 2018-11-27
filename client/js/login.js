import { API } from './utils/constants';
import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form');
	const errorMsg = document.querySelector('label.error-text');

	const handleServerError = (message) => {
		errorMsg.innerText = message || 'Something went wrong. Please try again later';
		document.querySelector('input[type="submit"]').removeAttribute('disabled');
	};

	const login = (event) => {
		event.preventDefault();

		const username = form.username.value;
		const password = form.password.value;
		errorMsg.innerText = '';
		document.querySelector('input[type="submit"]').setAttribute('disabled', 'true');
		const data = {
			username,
			password
		};
		makeRequest(API.users.login.url, API.users.login.method, data)
			.then(response => {
				return response.json();
			})
			.then(resData => {
				if (resData.token && resData.token.length) {
					localStorage.setItem('artisan_jwt', resData.token);
					localStorage.setItem('artisan_user', resData.token);
					window.location.href = '/';
				} else {
					handleServerError(resData.message);
				}
			})
			.catch((error) => {
				console.log(error);
				handleServerError(error.message);
			});
	};

	form.addEventListener('submit', login);
});
