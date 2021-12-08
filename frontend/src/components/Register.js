import React from "react";
import { Link, withRouter, useHistory } from "react-router-dom";

function Register(props) {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSetEmail(e) {
    setEmail(e.target.value);
  }
  function handleSetPasword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onRegister(email, password);
    history.push("/signin");
  }

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Регистрация</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <input
            className="popup__input popup__item login__item"
            name="email"
            id="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleSetEmail}
            autoComplete="off"
          />
          <input
            className="popup__input popup__item login__item"
            name="password"
            id="password"
            placeholder="Пароль"
            required
            type="password"
            value={password}
            autoComplete="off"
            onChange={handleSetPasword}
          />
          <button className="login__button">Зарегистрироваться</button>
          <p className="login__paragraph">
            Уже зарегистрированы?{" "}
            <Link to="/signin" className="login__link">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default withRouter(Register);
