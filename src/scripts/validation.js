const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const Validation = {
  settings,

  showInputError(formEl, inputEl, errorMsg) {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add(settings.inputErrorClass);
    errorMsgEl.classList.add(settings.errorClass);
  },

  hideInputError(formEl, inputEl) {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(settings.inputErrorClass);
    errorMsgEl.classList.remove(settings.errorClass);
  },

  checkInputValidity(formEl, inputEl) {
    if (!inputEl.validity.valid) {
      this.showInputError(formEl, inputEl, inputEl.validationMessage);
    } else {
      this.hideInputError(formEl, inputEl);
    }
  },

  disableButton(buttonEl) {
    buttonEl.disabled = true;
    buttonEl.classList.add(settings.inactiveButtonClass);
  },

  enableButton(buttonEl) {
    buttonEl.disabled = false;
    buttonEl.classList.remove(settings.inactiveButtonClass);
  },

  hasInvalidInput(inputList) {
    return inputList.some((input) => !input.validity.valid);
  },

  toggleButtonState(inputList, buttonEl) {
    if (this.hasInvalidInput(inputList)) {
      this.disableButton(buttonEl);
    } else {
      this.enableButton(buttonEl);
    }
  },

  resetValidation(formEl, inputList, buttonEl) {
    inputList.forEach((input) => {
      this.hideInputError(formEl, input);
    });

    this.enableButton(buttonEl);
  },

  setEventListeners(formEl) {
    const inputList = Array.from(
      formEl.querySelectorAll(settings.inputSelector),
    );

    const buttonEl = formEl.querySelector(settings.submitButtonSelector);

    this.toggleButtonState(inputList, buttonEl);

    inputList.forEach((input) => {
      input.addEventListener("input", () => {
        this.checkInputValidity(formEl, input);
        this.toggleButtonState(inputList, buttonEl);
      });
    });
  },

  enableValidation() {
    const formList = document.querySelectorAll(settings.formSelector);

    formList.forEach((formEl) => {
      this.setEventListeners(formEl);
    });
  },
};

module.exports = Validation;
