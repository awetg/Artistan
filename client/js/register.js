import { API } from './utils/constants';
import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	const formWrapper = document.querySelector('.form-wrapper');
	const form = document.querySelector('form');
	const registerSuccessElement = '<div class="register-success">Your registration is completed.\nWelcome to ARTisan!\nYou now can <a href="/login">Login</a>.</div>';
	const errorMsg = document.querySelector('label.error-text');

	const handleServerError = (error) => {
		errorMsg.innerText = 'Something went wrong. Please try again later';
		if (error.message && error.message.indexOf('Duplicate') > -1) {
			if (error.message.indexOf('unique_username') > -1) {
				errorMsg.innerText = 'This username is already taken.';
			} else if (error.message.indexOf('unique_email') > -1) {
				errorMsg.innerText = 'This email is already taken.';
			}
		}
		document.querySelector('button[type="submit"]').removeAttribute('disabled');
	};

	const register = (event) => {
		event.preventDefault();

		const email = form.email.value;
		const fullname = form.fullname.value;
		const username = form.username.value;
		const password = form.password.value;
		const rePassword = form.rePassword.value;

		const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
		const usernameRegex = /^[a-z0-9_-]{3,15}$/;
		let isFormValid = true;

		// check required fields
		if (!email.length || !fullname.length || !username.length || !password.length || !rePassword.length) {
			isFormValid = false;
			errorMsg.innerText = 'Please fill in all fields.';
		}

		// check format
		if (!emailRegex.test(email)) {
			isFormValid = false;
			errorMsg.innerText = 'Invalid email format.';
		}

		// check username
		if (!usernameRegex.test(username)) {
			isFormValid = false;
			errorMsg.innerText = 'Invalid username.';
		}

		// check if password length is long enough
		if (password.length < 6) {
			isFormValid = false;
			errorMsg.innerText = 'Please use a longer password.';
		}

		// check if passwords match
		if (password !== rePassword) {
			isFormValid = false;
			errorMsg.innerText = 'Re-type password didn\'t match.';
		}

		if (!isFormValid) {
			return;
		} else {
			errorMsg.innerText = '';
			document.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
			const data = {
				email,
				fullname,
				username,
				password
			};
			makeRequest(API.users.register.url, API.users.register.method, data)
				.then(resData => {
					if (resData.user_id) {
						formWrapper.removeChild(form);
						formWrapper.insertAdjacentHTML('afterbegin', registerSuccessElement);
					} else {
						handleServerError(resData);
					}
				})
				.catch((error) => {
					console.log(error);
					handleServerError(error);
				});
		}
	};

	form.addEventListener('submit', register);
});
