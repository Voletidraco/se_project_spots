require("./index.css");
const Api = require("../utils/Api.js");
const setButtonText = require("../utils/helpers.js");

const Validation = require("../scripts/validation.js");

const logo = require("../images/logo.svg");
const editIcon = require("../images/edit_icon.svg");
const avatarEditIcon = require("../images/edit_icon-light.svg");
const plusIcon = require("../images/plus_icon.svg");

document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__edit-icon").src = editIcon;
document.querySelector(".avatar__edit-icon").src = avatarEditIcon;
document.querySelector(".profile__plus-icon").src = plusIcon;

const profileAvatarEl = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0eeba406-e40b-444f-86c1-5c643f2144f8",
    "Content-Type": "application/json",
  },
});

let currentUserId;

api
  .getAppInfo()
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    cards.forEach((item) => {
      renderCard(item, "append");
    });

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    document.querySelector(".profile__avatar").src = userData.avatar;
  })
  .catch(console.error);

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", handleModalClick);
});

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = document.querySelector("#edit-profile-form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");

const avatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.querySelector("#edit-avatar-form");
const avatarInput = editAvatarModal.querySelector("#profile-avatar-input");
const editAvatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".delete_modal__form");
const cancelBtn = deleteModal.querySelector(".modal__cancel-btn");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const addCardFormEl = document.querySelector("#add-card-form");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const cardCaptionInput = newPostModal.querySelector("#card-caption-input");
const imageLinkInput = newPostModal.querySelector("#card-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleCardDelete(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  previewCaptionEl.textContent = data.name;
  openModal(previewModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardLikeBtnEl.classList.toggle("card__like-button_active", data.isLiked);

  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data));
  cardDeleteBtnEl.addEventListener("click", () =>
    handleCardDelete(cardElement, data._id),
  );
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function handleLike(evt, cardData) {
  const buttonEl = evt.currentTarget;
  const isCurrentlyLiked = buttonEl.classList.contains(
    "card__like-button_active",
  );

  api
    .likeState(cardData._id, !isCurrentlyLiked)
    .then((updatedCard) => {
      cardData.isLiked = updatedCard.isLiked;
      buttonEl.classList.toggle(
        "card__like-button_active",
        updatedCard.isLiked,
      );
    })
    .catch((err) => {
      console.error(err);
      buttonEl.classList.toggle("card__like-button_active", isCurrentlyLiked);
    });
}

function handleModalClick(evt) {
  const modal = evt.currentTarget;

  if (
    evt.target === modal ||
    evt.target.classList.contains("modal") ||
    evt.target.classList.contains("modal__close-btn") ||
    evt.target.classList.contains("delete_modal__close-btn")
  ) {
    closeModal(modal);
  }
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_is-opened");
    closeModal(openedPopup);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  Validation.resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    editProfileSubmitBtn,
  );

  openModal(editProfileModal);
});

avatarBtn.addEventListener("click", () => {
  avatarInput.value = profileAvatarEl.src;

  Validation.resetValidation(
    editAvatarForm,
    [avatarInput],
    editAvatarSubmitBtn,
  );

  openModal(editAvatarModal);
});

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: cardCaptionInput.value,
    link: imageLinkInput.value,
  };

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard(inputValues)
    .then((cardData) => {
      renderCard(cardData);
      addCardFormEl.reset();
      Validation.disableButton(cardSubmitBtn);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

addCardFormEl.addEventListener("submit", handleAddCardSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

cancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

Validation.enableValidation();
