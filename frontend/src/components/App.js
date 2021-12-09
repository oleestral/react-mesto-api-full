import React from "react";
import "../index.css";
import Header from "../components/Header";
import Main from "./Main";
import Footer from "../components/Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  BrowserRouter,
} from "react-router-dom";
import auth from "../utils/auth";

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = React.useState({ name: "", about: "" });
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [imageOpened, setImageOpened] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);

  // user data & initial cards
  function getGeneralData() {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([info, card]) => {
        setCurrentUser(info);
        setCards(card);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //delete card
  function handleDeleteClick(card) {
    api
      .removeUserCards(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // update user profile
  function handleUpdateUser({ name, about }) {
    api
      .editUserProfile(name, about)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // update user avatar
  function handleUpdateAvatar(link) {
    api
      .updateUserAvatar(link)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // add card
  function handleAddCard({ name, link }) {
    api
      .addUserCards(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // open card
  function handleCardClick(item) {
    setImageOpened(!imageOpened);
    setSelectedCard(item);
  }
  // for openning add popup
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }
  // for openning avatar popup
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }
  // for openning profile popup
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  // close popups
  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard({});
    setImageOpened(false);
    setIsInfoTooltipPopupOpen(false);
  }
  // like
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //login
  function handleSignIn(email, password) {
    auth
      .signIn(email, password)
      .then((item) => {
        localStorage.setItem("jwt", item.token);
        setLoggedIn(true);
        setEmail(email);
        console.log(email);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //signup
  function handleSignUp(email, password) {
    auth
      .signUp(email, password)
      .then((item) => {
        setSuccess(true);
        setIsInfoTooltipPopupOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        setIsInfoTooltipPopupOpen(true);
      });
  }
  //logout
  function handleLogOut() {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/signin");
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    auth
      .checkToken(jwt)
      .then((item) => {
        setLoggedIn(true);
        setEmail(item.email);
        if(item) {
          getGeneralData()
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // closing popups by Escape
  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root" id="root">
        <div className="page">
          <BrowserRouter>
            <Header email={email} onLogOut={handleLogOut} loggedIn={loggedIn} />
            <Switch>
              <ProtectedRoute
                exact
                path="/"
                loggedIn={loggedIn}
                component={Main}
                isAddPlacePopupOpen={handleAddPlaceClick}
                isEditProfilePopupOpen={handleEditProfileClick}
                isEditAvatarPopupOpen={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteClick}
                cards={cards}
                email={email}
              />
              <Route path="/signin">
                {loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <Login onLogin={handleSignIn} />
                )}
              </Route>
              <Route path="/signup">
                {loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <Register onRegister={handleSignUp} />
                )}
              </Route>
              <Route path="/">
                {!loggedIn ? <Redirect to="/" /> : <Redirect to="/signup" />}
              </Route>
            </Switch>
          </BrowserRouter>
          {loggedIn && <Footer />}
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCard}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={imageOpened}
          />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            isSuccessful={success}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
