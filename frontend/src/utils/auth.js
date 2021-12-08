class Auth {
  constructor({ BASE_URL, headers  }) {
    this._url = BASE_URL;
    this._headers = headers;
  }
  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }
  signIn(email, password) {
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email: email, password: password }),
    }).then(this._getResponseData);
  }
  signUp(email, password) {
    return fetch(`${this._url}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email: email, password: password }),
    }).then(this._getResponseData);
  }
  checkToken(token) {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._getResponseData);
  }
}
const auth = new Auth({ BASE_URL: "http://localhost:3000",
headers: {
  "Content-Type": "application/json",
  "Accept": "application/json"
} });
export default auth;
