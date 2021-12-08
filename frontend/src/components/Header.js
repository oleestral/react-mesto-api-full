import React from "react";
import logo from "../images/logo.svg";
import { Link, useLocation } from "react-router-dom";

function Header(props) {
  const location = useLocation();
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Место Россия" />
      {props.loggedIn ? (
        <div className="header__box">
          <p className="header__link">{props.email}</p>
          <button
            className="header__btn"
            onClick={props.onLogOut}
            type="submit"
          >
            Выйти
          </button>
        </div>
      ) : (
        <Link
          to={location.pathname === "/signin" ? "/signup" : "/signin"}
          className="header__link"
        >
          {`${location.pathname === "/signin" ? "Регистрация" : "Войти"}`}
        </Link>
      )}
    </header>
  );
}
export default Header;
