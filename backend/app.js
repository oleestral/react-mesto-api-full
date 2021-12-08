const express = require('express');

const mongoose = require('mongoose');

const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/user');
const cardsRouter = require('./routes/card');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/NotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require("cors");

const { PORT = 3000 } = process.env;

const app = express();
const corses = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3001",
  "https://oleestral.nomoredomains.work/",
  "http://oleestral.nomoredomains.work/",
  "https://api.oleestral.nomoredomains.work",
  "http://api.oleestral.nomoredomains.work"

]

const policy = (req, res, next) => {
  const { origin } = req.headers;
  if (corses.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.status(200).send({ message: 'OK' });
  }

  next();
};

// connect to server
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(cors(corses))
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        // eslint-disable-next-line comma-dangle
        /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/
      ),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  createUser
);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use(errorLogger);
app.use((req, res, next) => {
  next(new NotFound('Ресурс не найден'));
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
