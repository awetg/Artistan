export const checkUserLoggedIn = () => {
	const userInfo = JSON.parse(localStorage.getItem('artisan_user'));
	if (userInfo.user_id) {
		const newElements = '<div class="nav-links"><a class="" href="/upload">Upload</a><a class="" href="/profile">Profile</a><a class="" href="/logout">Log out</a></div>';
		const appHeader = document.querySelector('#app-header');
		appHeader.removeChild(document.querySelector('.login-link'));
		appHeader.insertAdjacentHTML('afterbegin', newElements);
	}
};

const columnWidth = 400; // 400px width for each image
export const calculateGalleryCols = () => {
	const gallery = document.querySelector('.gallery');
	gallery.style.columnCount = Math.floor(document.documentElement.clientWidth / columnWidth);
};

