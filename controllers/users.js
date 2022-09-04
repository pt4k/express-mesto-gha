const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidError = require('../errors/ValidError');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { AUTH_ERROR_CODE } = require('../errors/errors');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные при создании пользователя.'));
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные для поиска пользователя.'));
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};

const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные при обновлении аватара.'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('token', token, { httpOnly: true });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === AUTH_ERROR_CODE) {
        next(new AuthError('Неправильные почта или пароль'));
      }
      next(err);
    });
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден.');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные для поиска пользователя.'));
      }
      next(err);
    });
};

module.exports = {
  createUser, getUser, getUsers, patchUser, patchAvatar, login, getUserMe,
};
