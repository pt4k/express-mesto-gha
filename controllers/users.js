const User = require('../models/user');

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля.' });
      } else {
        res.status(500).send({ message: `Ошибка сервера: ${err}` });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует в базе');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Указан некорректный id пользователя' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Пользователь по заданному id отсутствует в базе' });
      } else {
        res.status(500).send({ message: `Ошибка сервера: ${err}` });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: `Запрашиваемый пользователь не найден. Ошибка: ${err}` }));
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true, upsert: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля.' });
      } else {
        res.status(500).send({ message: `Ошибка сервера: ${err}` });
      }
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
      console.log(user);
    })
    .catch((err) => res.status(500).send({ message: `Запрашиваемый пользователь не найден. Ошибка: ${err}` }));
};

module.exports = {
  createUser, getUser, getUsers, patchUser, patchAvatar,
};
