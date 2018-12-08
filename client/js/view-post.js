'use strict';

import { checkUserLoggedIn, initApp } from './utils/shared-functions';

document.addEventListener('DOMContentLoaded', () => {
	initApp();
	checkUserLoggedIn(true);
});
