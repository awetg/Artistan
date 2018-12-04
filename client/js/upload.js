import { checkUserLoggedIn, initApp } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	initApp().then(() => {
		renderCategoriesSelectBox();
	});
	checkUserLoggedIn();

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
		console.log(categories);
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
		let imageType = /image.*/;
		if (!file.type.match(imageType)) {
			showError('Please select an image.');
		} else if (!file) {
			showError('Sorry. File not found');
		} else {
			previewImage(file);
		}
	};

	const createPost = () => {
		let data = new FormData();
		data.append('title', titleInput.value);
	};

	uploadButton.addEventListener('click', () => {
		fileInput.click();
	});

	fileInput.addEventListener('change', getFile);

	form.addEventListener('submit', (e) => {});
});
