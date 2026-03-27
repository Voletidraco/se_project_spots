// utils/Api.js

class Api {
  constructor(options) {
    this._options = options;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getUserInfo() {
    return this._request(`${this._options.baseUrl}/users/me`, {
      headers: this._options.headers,
    });
  }

  editUserInfo({ name, about }) {
    return this._request(`${this._options.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._options.headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
  }

  editAvatarInfo(avatar) {
    return this._request(`${this._options.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._options.headers,
      body: JSON.stringify({
        avatar,
      }),
    });
  }

  addCard({ name, link }) {
    return this._request(`${this._options.baseUrl}/cards`, {
      method: "POST",
      headers: this._options.headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    });
  }

  deleteCard(id) {
    return this._request(`${this._options.baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._options.headers,
    });
  }

  likeState(id, isLiked) {
    return this._request(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._options.headers,
    });
  }

  getInitialCards() {
    return this._request(`${this._options.baseUrl}/cards`, {
      headers: this._options.headers,
    });
  }
}

module.exports = Api;
