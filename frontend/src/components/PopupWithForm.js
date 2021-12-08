import React from "react";

function PopupWithForm(props) {
  return (
    <div
      className={`popup popup-close popup-${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={props.onClose}
        ></button>
        <h2 className="popup__edit-profile">{props.title}</h2>
        <form
          name={`input-container form-${props.name}`}
          className="popup__form popup__input-container "
          onSubmit={props.onSubmit}
        >
          <fieldset className="popup__set">{props.children}</fieldset>
          <button
            type="submit"
            className="popup__submit popup__submit-button popup__save-button"
          >
            {props.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default PopupWithForm;
