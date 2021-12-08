import React from "react";
import { withRouter, useHistory } from "react-router-dom";

function Login(props) {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }
  function handleChangePasword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onLogin(email, password);
    history.push("/");
  }

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Вход</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <input
            className="popup__input popup__item login__item"
            name="email"
            id="email"
            placeholder="Email"
            required
            type="email"
            value={email}
            onChange={handleChangeEmail}
          />
          <input
            className="popup__input popup__item login__item"
            name="password"
            id="password"
            placeholder="Пароль"
            required
            type="password"
            password={password}
            onChange={handleChangePasword}
          />
          <button className="login__button">Войти</button>
        </form>
      </div>
    </div>
  );
}
export default withRouter(Login);
