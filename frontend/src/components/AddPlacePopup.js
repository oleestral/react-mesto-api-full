import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [place, setPlace] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleChangeLink(e) {
    setLink(e.target.value);
  }
  function handleChangePlace(e) {
    setPlace(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.onAddCard({
      name: place,
      link,
    });
  }
  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <div className="popup__section">
        <input
          className="popup__input popup__item popup__item_card_name"
          type="text"
          id="name-place"
          name="name"
          placeholder="Название"
          autoComplete="off"
          minLength="2"
          maxLength="30"
          required
          value={place}
          onChange={handleChangePlace}
        />
        <span className="popup__input-type-error name-place-error"></span>
      </div>
      <div className="popup__section">
        <input
          className="popup__input popup__item popup__item_card_link"
          type="url"
          id="link"
          name="link"
          placeholder="Cсылка на картинку"
          autoComplete="off"
          required
          value={link}
          onChange={handleChangeLink}
        />
        <span className="popup__input-type-error link-error"></span>
      </div>
    </PopupWithForm>
  );
}
export default AddPlacePopup;
