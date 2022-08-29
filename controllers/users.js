const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidError = require('../errors/ValidError');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const { NOTFOUND_ERROR_CODE } = require('../errors/errors');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Переданы некорректные данные при создании пользователя.');
      }
      res.status(201).send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => {
      if (!user) {
        throw new ValidError('Переданы некорректные данные при создании пользователя.');
      }
      res.send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new ValidError('Переданы некорректные данные при создании пользователя.');
      }
      res.send(user);
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ValidError('Переданы некорректные данные при обновлении профиля.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ValidError('Переданы некорректные данные при обновлении аватара.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      const token = jwt.sign({ _id: user.id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, getUsers, patchUser, patchAvatar, login,
};
