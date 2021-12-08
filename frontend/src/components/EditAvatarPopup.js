import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const ref = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: ref.current.value,
    });
  }

  return (
    <PopupWithForm
      name="update"
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText="Сохранить"
      onSubmit={handleSubmit}
    >
      <div className="popup__section">
        <input
          className="popup__input popup__item popup__item_avatar_link"
          type="url"
          id="avatar"
          name="avatar"
          placeholder="Cсылка на картинку"
          autoComplete="off"
          required
          ref={ref}
        />
        <span className="popup__input-type-error avatar-error"></span>
      </div>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;
