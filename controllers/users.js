const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidError = require('../errors/ValidError');
// const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const {
  VALID_ERROR_CODE, NOTFOUND_ERROR_CODE, DEFAULT_ERROR_CODE, AUTH_ERROR_CODE,
} = require('../errors/errors');
const SALT_ROUNDS = 10;

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(VALID_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    });
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    /*
    if (!user) {
        console.log(user);
        throw new AuthError('Неправильные почта или пароль');
      } */
      const token = jwt.sign({ _id: user.id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('token', token, { httpOnly: true });
      res.send({ token });
    })
    .catch(() => {
      res.status(AUTH_ERROR_CODE).send('Неправильные почта или пароль');
    });
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь по указанному _id не найден.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, getUsers, patchUser, patchAvatar, login, getUserMe,
};
