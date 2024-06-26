import { isEscapeKey } from './util.js';
import { resetScale } from './scale.js';
import { resetEffects } from './effects.js';
import { sendData } from './api.js';
import { openSuccessMessage } from './messages.js';

const MAX_DESCRIPTION_LENGTH = 140;
const MAX_HASHTAG_LENGTH = 5;
const HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;

const SubmitButtonText = {
  IDLE: 'ОПУБЛИКОВАТЬ',
  SENDING: 'ПУБЛИКУЮ..'
};

const imgUploadFormElement = document.querySelector('#upload-select-image');
const imgUploadElement = document.querySelector('.img-upload__overlay');
const uploadFileElement = document.querySelector('#upload-file');
const closeImgEditingFormElement = document.querySelector('#upload-cancel');
const textHashtagsFieldElement = document.querySelector('.text__hashtags');
const textDescriptionFieldElement = document.querySelector('.text__description');
const submitButtonElement = document.querySelector('#upload-submit');

const blockSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = SubmitButtonText.IDLE;
};

textHashtagsFieldElement.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});

textDescriptionFieldElement.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});

const pristine = new Pristine(imgUploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
});

const validateDescription = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

pristine.addValidator(textDescriptionFieldElement,
  validateDescription,
  'Максимальная длина 140 символов'
);

const checkLengthHashtag = (value) => value.length <= MAX_HASHTAG_LENGTH;

const checkSymbolsHashtag = (item) => HASHTAG.test(item);

const checkRepeatHashtag = (item) => {
  const lowerHashtag = item.map((tag) => tag.toLowerCase());
  return lowerHashtag.length === new Set(lowerHashtag).size;
};

const validateHashtag = (value) => {
  const hashtags = value.trim().split(' ').filter((tag) => tag.trim().length);
  return checkLengthHashtag(hashtags) && hashtags.every(checkSymbolsHashtag) && checkRepeatHashtag(hashtags);
};

pristine.addValidator(textHashtagsFieldElement,
  validateHashtag,
  'Хэштег введен неверно',
);

const clearForm = () => {
  imgUploadFormElement.reset();
  pristine.reset();
};

const closeFormModal = () => {
  clearForm();
  resetScale();
  resetEffects();
  imgUploadElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

const openFormModal = () => {
  imgUploadElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt) && !document.querySelector('.error')) {
    evt.preventDefault();
    closeFormModal();
  }
}

uploadFileElement.addEventListener('change', () => {
  openFormModal();
});

closeImgEditingFormElement.addEventListener('click', () => {
  closeFormModal();
});

const setUserFormSubmit = () => {
  imgUploadFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          closeFormModal();
          openSuccessMessage();
        })
        .catch((err) => err)
        .finally(unblockSubmitButton);
    }
  });
};

setUserFormSubmit();
