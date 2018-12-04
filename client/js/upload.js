import { checkUserLoggedIn } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	checkUserLoggedIn();

	const uploadButton = document.querySelector('button.select-file');
	const fileInput = document.querySelector('#upload-input');
	const errorBox = document.querySelector('label.error-text');

	const showError = (content) => {
		errorBox.innerText = content;
	};

	const getFile = (e) => {
		console.log(e);
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
		console.log(file);
		if (!file.type.match(imageType)) {
			showError('Please select an image.');
		} else if (!file) {
			showError('Sorry. File not found');
		} else {
			previewImage(file);
		}
	};

	uploadButton.addEventListener('click', () => {
		fileInput.click();
	});

	fileInput.addEventListener('change', getFile);
});
