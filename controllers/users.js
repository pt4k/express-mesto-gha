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
      throw new Error('Карточка или пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера: ${err}` }));
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
    .catch((err) => res.status(500).send({ message: `Запрашиваемый пользователь не найден. Ошибка: ${err}` }));
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, avatar, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Запрашиваемый пользователь не найден. Ошибка: ${err}` }));
};

module.exports = {
  createUser, getUser, getUsers, patchUser, patchAvatar,
};
