import React from "react";
import success from "../images/success.svg";
import error from "../images/error.svg";

function InfoTooltip(props) {
  return (
    <div className={`popup popup-close ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__image"
          src={props.isSuccessful ? success : error}
          alt={props.isSuccessful ? "Успешно" : "Ошибка"}
        />
        <h2 className="popup__edit-profile popup__tooltip-title">
          {props.isSuccessful
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}{" "}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
