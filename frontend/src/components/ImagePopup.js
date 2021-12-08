import React from 'react';


function ImagePopup(props) {
    return (
        <div className = {`popup popup-open popup-close ${props.isOpen ? "popup_opened" : ""}`}>
            <div className = "popup-open__container">
                <button type = "button" className = "popup__close-button popup-open__close-button" onClick={props.onClose}></button>
                <img className = "popup-open__image" src = {props.card.link} alt = {props.card.name} id = "opened-image"/>
                <h3 className = "popup-open__title" id = "popup-open-title">{props.card.name}</h3>
            </div>
        </div>
    )
}
export default ImagePopup;