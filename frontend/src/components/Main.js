import React from "react";
import pencil from "../images/pencil.svg";
import closeIcon from "../images/CloseIcon.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <img
          className="profile__avatar"
          src={currentUser.avatar}
          alt="аватар"
        />
        <img
          className="profile__avatar-edit"
          src={pencil}
          alt="Редактировать профиль"
          onClick={props.isEditAvatarPopupOpen}
        />
        <div className="profile__info">
          <div className="profile__info-items">
            <h1 className="profile__info-name">{currentUser.name}</h1>
            <p className="profile__info-self-description">
              {currentUser.about}
            </p>
          </div>
          <button
            type="button"
            className="profile__info-edit-button button"
            onClick={props.isEditProfilePopupOpen}
          ></button>
        </div>
        <button
          type="button"
          className="profile__info-add-button button"
          onClick={props.isAddPlacePopupOpen}
        >
          <img
            className="profile__info-add-button-image"
            src={closeIcon}
            alt="Кнопка добавить"
          />
        </button>
      </section>
      <section className="elements">
        {props.cards.map((item) => {
          return (
            <Card
              key={item._id}
              card={item}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          );
        })}
      </section>
    </main>
  );
}
export default Main;
