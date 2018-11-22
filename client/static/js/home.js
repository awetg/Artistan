const columnWidth = 400; // 400px width for each image
const calculateGalleryCols = () => {
  const gallery = document.querySelector('.gallery');
  gallery.style.columnCount = Math.floor(document.documentElement.clientWidth / columnWidth);
}

document.addEventListener('scroll', () => {
  const appHeader = document.querySelector('#app-header');
  if (document.documentElement.scrollTop >= 100) {
    if (appHeader.className.indexOf(' shrink') < 0) {
      appHeader.className += ' shrink';
    }
  } else {
    appHeader.className = appHeader.className.replace(' shrink', '');
  }
});

document.querySelector('.gallery').addEventListener('click', (e) => {
  if (e.target !== e.currentTarget) {
    console.log('click');
    e.stopPropagation();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  calculateGalleryCols();
});
window.addEventListener('resize', () => {
  calculateGalleryCols();
});
