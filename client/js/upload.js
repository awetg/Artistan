'use strict';

import { initApp, checkUserLoggedIn } from './utils/shared-functions';
import { API } from './utils/constants';
import { makeRequest } from './utils/network';

document.addEventListener('DOMContentLoaded', () => {
	checkUserLoggedIn(true);
	initApp().then(() => {
		renderCategoriesSelectBox();
	});

	const form = document.querySelector('form');
	const uploadButton = document.querySelector('button.select-file');
	const fileInput = document.querySelector('#upload-input');
	const titleInput = document.querySelector('.title-input');
	const errorBox = document.querySelector('label.error-text');

	const showError = (content) => {
		errorBox.innerText = content;
	};

	const renderCategoriesSelectBox = () => {
		const categories = JSON.parse(localStorage.getItem('categories'));
		const content = categories.reduce((total, cate) => {
			return `${ total }<label><input value="${ cate.category_id }" type="checkbox"><span>${ cate.name }</span></label>`;
		}, '');
		document.querySelector('.multiple-select').insertAdjacentHTML('afterbegin', content);
	};

	const getFile = (e) => {
		let file = e.currentTarget.files[0];
		checkType(file);
	};

	const previewImage = (file) => {
		let previewBox = document.querySelector('.image-preview');
		let reader = new FileReader();

		reader.onload = () => {
			previewBox.style.backgroundImage = 'url(' + reader.result + ')';
			document.querySelector('.upload').classList.add('uploaded');
			uploadButton.innerText = 'Select another image';
		};
		reader.readAsDataURL(file);
	};

	const checkType = (file) => {
		const imageType = /image.*/;
		if (!file.type.match(imageType)) {
			showError('Please select an image.');
		} else if (!file) {
			showError('Sorry. File not found');
		} else {
			previewImage(file);
		}
	};

	const createPost = () => {
		let data = new FormData(document.querySelector('form'));
		let selectedCategories = [];

		// collect categories
		document.querySelectorAll('.multiple-select input').forEach(checkbox => {
			if (checkbox.checked) {
				selectedCategories.push(checkbox.value);
			}
		});

		if (!selectedCategories.length) {
			document.querySelector('.category.error-text').innerText = 'Please select at least 1 category.';
		} else {
			// prepare form data
			data.append('category', JSON.stringify(selectedCategories));

			makeRequest(API.post.createPost.url, API.post.createPost.method, data, true)
				.then(resData => {
					if (resData.post_id) {
						window.location.href = '/';
					} else {
						// handleServerError(resData.message);
					}
				})
				.catch((error) => {
					console.log(error);
				// handleServerError(error.message);
				});
		}
	};

	uploadButton.addEventListener('click', () => {
		fileInput.click();
	});

	fileInput.addEventListener('change', getFile);

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		createPost();
	});
});
