const imgFiltersContainer = document.querySelector('.img-filters');
const filterDefaultButton = document.querySelector('#filter-default');
const filterRandomButton = document.querySelector('#filter-random');
const filterDiscussedButton = document.querySelector('#filter-discussed');

// let picturesContainer = [];

let sortElement;

const takeOffSortElement = () => {
  document.removeEventListener('click', onDocumentClick);
};

function onDocumentClick (evt) {
  if (sortElement === evt.target) {
    takeOffSortElement();
  }
}

const showImgFilters = () => {
  imgFiltersContainer.classList.remove('img-filters--inactive');
};

const sortPhotosByComments = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const sortPhotosByRandom = () => Math.random() - 0.5;

const getDefaultPhotos = (cb) => {

  filterDefaultButton.addEventListener('click', () => {
    filterRandomButton.classList.toggle('img-filters__button--active');
    cb();
    takeOffSortElement();
  });
};

const getRandomPhotos = (cb) => {

  filterRandomButton.addEventListener('click', () => {
    filterRandomButton.classList.toggle('img-filters__button--active');
    cb();
    takeOffSortElement();
  });
};

const getDiscussedPhotos = (cb) => {

  filterDiscussedButton.addEventListener('click', () => {
    filterDiscussedButton.classList.toggle('img-filters__button--active');
    cb();
    takeOffSortElement();
  });
};

export { showImgFilters, sortPhotosByComments, sortPhotosByRandom, getDefaultPhotos, getRandomPhotos, getDiscussedPhotos };
