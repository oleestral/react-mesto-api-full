const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;
// controllers/users.js

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((userEmail) => {
      if (userEmail) {
        next(new Conflict('Пользователь с таким email уже существует'));
      }
      bcrypt
        .hash(password, 10)
        .then(
          (hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }),
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
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('Нет пользователя по заданному id'))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет пользователя по заданному id'));
      } else {
        next(err);
      }
    });
};
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    { new: true, runValidators: true },
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
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    { new: true, runValidators: true },
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
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль'));
      } else {
        bcrypt
          .compare(password, user.password)

          .then((matched) => {
            if (!matched) {
              throw (new Error('Неправильные почта или пароль'));
            } else {
              const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
              return res.status(200).send({ token });
            }
          })
          .catch(next);
      }
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
      } else {
        next(err);
      }
    });
};
