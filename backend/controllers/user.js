const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');
// controllers/users.js

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((userEmail) => {
      if (userEmail) {
        next(new Conflict('Пользователь с таким email уже существует'));
      }
      bcrypt
        .hash(password, 10)
        .then(
          (hash) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            User.create({
              name,
              about,
              avatar,
              email,
              password: hash,
              // eslint-disable-next-line comma-dangle
            })
          // eslint-disable-next-line function-paren-newline
        )
        .then((data) => {
          res.status(200).send({ _id: data.id, email: data.email });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest(err.message));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет пользователя по заданному id'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Нет пользователя по заданному id'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .orFail(new Error('NotFound'))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет пользователя по заданному id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Данные некорректны'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Нет пользователя по заданному id'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .orFail(new Error('NotFound'))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет пользователя по заданному id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Данные некорректны'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Нет пользователя по заданному id'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль'));
      }
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user.id }, 'super-strong-secret', {
            expiresIn: '7d',
          });
          return res.status(200).send({ token });
        })
        .catch((err) => {
          next(new Unauthorized(err.message));
        })
        .catch(next);
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((item) => {
      if (!item) {
        next(new Error('Пользователь не найден'));
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный id'));
      }
      next(err);
    })
    .catch(next);
};
