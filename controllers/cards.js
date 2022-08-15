const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля.' });
      } else {
        res.status(500).send({ message: `Ошибка сервера: ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Запрашиваемая карточка не найдена. Ошибка: ${err}` }));
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Запрашиваемая карточка не найдена. Ошибка: ${err}` }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Запрашиваемая карточка не найдена. Ошибка: ${err}` }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Запрашиваемая карточка не найдена. Ошибка: ${err}` }));
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
