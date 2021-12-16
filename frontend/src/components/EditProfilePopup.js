import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <div className="popup__section">
        <input
          className="popup__input popup__item popup__item_type_name"
          type="text"
          id="name"
          name="name"
          placeholder="Ваше имя"
          autoComplete="off"
          minLength="2"
          maxLength="40"
          required
          value={name || ""}
          onChange={handleChangeName}
        />
        <span className="popup__input-type-error name-error"></span>
      </div>
      <div className="popup__section">
        <input
          className="popup__input popup__item popup__item_type_caption"
          type="text"
          id="about"
          name="about"
          placeholder="О себе"
          autoComplete="off"
          minLength="2"
          maxLength="200"
          required
          value={description || ""}
          onChange={handleChangeDescription}
        />
        <span className="popup__input-type-error caption-error"></span>
      </div>
    </PopupWithForm>
  );
}
export default EditProfilePopup;
