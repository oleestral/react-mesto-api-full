class Api {
  constructor({ address }) {
    this._address = address;
  }
  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }
  //user information
  getUserInfo(token) {
    return fetch(`${this._address}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
    }).then(this._getResponseData);
  }
  //edit user profile
  editUserProfile(name, about, token) {
    return fetch(`${this._address}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this._getResponseData);
  }
  //get Initial Cards
  getInitialCards(token) {
    return fetch(`${this._address}/cards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
    }).then(this._getResponseData);
  }
  //add user's cards
  addUserCards(name, link, token) {
    return fetch(`${this._address}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._getResponseData);
  }
  //remove user's card
  removeUserCards(id, token) {
    return fetch(`${this._address}/cards/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
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
  updateUserAvatar(info, token) {
    return fetch(`${this._address}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar: info.avatar,
      }),
    }).then(this._getResponseData);
  }
  changeLikeCardStatus(id, isLiked, token) {
    const method = isLiked ? "DELETE" : "PUT";
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      },
    }).then(this._getResponseData);
  }
}

const api = new Api({
  address: "https://api.oleestral.nomoredomains.work",
});
export default api;
