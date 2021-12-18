const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const {
  createCard,
  deleteCard,
  getCards,
  like,
  dislike,
} = require('../controllers/card');

cardRouter.get('/cards', getCards);
cardRouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .regex(
          /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/,
        )
        .required(),
    }),
  }),
  createCard,
);

cardRouter.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard,
);
cardRouter.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  like,
);
cardRouter.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  dislike,
);

module.exports = cardRouter;
