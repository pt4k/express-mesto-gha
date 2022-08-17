const Card = require('../models/card');
const { VALID_ERROR_CODE, NOTFOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../errors/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error('Карточка с указанным _id не найдена.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.statusCode === NOTFOUND_ERROR_CODE) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Карточка с указанным _id не найдена.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.statusCode === NOTFOUND_ERROR_CODE) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Карточка с указанным _id не найдена.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.statusCode === NOTFOUND_ERROR_CODE) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
