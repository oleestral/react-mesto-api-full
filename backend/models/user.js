const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Путешественник, исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://avatars.mds.yandex.net/get-zen_doc/2391871/pub_5ee229a599422b3358f32814_5ee229e53b44f16ea3db0835/scale_1200',
    validate: {
      validator(link) {
        return /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\\/])*)?/.test(
          // eslint-disable-next-line comma-dangle
          link
        );
      },
      message: 'Вставьте фотографию!',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(mail) {
        return validator.isEmail(mail);
      },
      message: 'Некорректный email!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
