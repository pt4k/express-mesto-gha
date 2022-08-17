const User = require('../models/user');
const { VALID_ERROR_CODE, NOTFOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../errors/errors');

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.statusCode === 404) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.statusCode === 404) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь c указанным _id не найден.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.statusCode === NOTFOUND_ERROR_CODE) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь c указаныым _id не найден.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports = {
  createUser, getUser, getUsers, patchUser, patchAvatar,
};
