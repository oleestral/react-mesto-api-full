class Api {
  constructor({ address, headers }) {
    this._address = address;
    this._headers = headers;
  }
  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }
  //user information
  getUserInfo() {
    return fetch(`${this._address}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then(this._getResponseData);
  }
  //edit user profile
  editUserProfile(name, about) {
    return fetch(`${this._address}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this._getResponseData);
  }
  //get Initial Cards
  getInitialCards() {
    return fetch(`${this._address}/cards`, {
      method: "GET",
      headers: this._headers,
    }).then(this._getResponseData);
  }
  //add user's cards
  addUserCards(name, link) {
    return fetch(`${this._address}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._getResponseData);
  }
  //remove user's card
  removeUserCards(id) {
    return fetch(`${this._address}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._getResponseData);
  }
  //like post
  like(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this._getResponseData);
  }
  //remove like
  removeLike(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then(this._getResponseData);
  }
  //update user avatar
  updateUserAvatar(info) {
    return fetch(`${this._address}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: info.avatar,
      }),
    }).then(this._getResponseData);
  }
  changeLikeCardStatus(id, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: method,
      headers: this._headers,
    }).then(this._getResponseData);
  }
}

const api = new Api({
  address: "http://localhost:3000",
  headers: {
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  },
});
export default api;
