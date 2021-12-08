const card = require('../models/card');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .then((item) => res.send(item))
    .catch((err) => next(err));
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  card
    .create({
      name,
      link,
      owner: req.user._id,
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка при создании карточки'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  card
    .findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((item) => {
      if (req.user._id !== item.owner.toString()) {
        next(new Error('Нельзя удалять чужие посты!'));
      }
      item.remove();
      res.status(200).send({ message: 'Карточка успешно удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет карточки по заданному id'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Нет карточки по заданному id'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.like = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .orFail(new Error('NotFound'))
    .then((like) => {
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет карточки по заданному id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Данные некорректны'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Нет карточки по заданному id'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.dislike = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .orFail(new Error('NotFound'))
    .then((like) => {
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Нет карточки по заданному id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Данные некорректны'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Нет карточки по заданному id'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
