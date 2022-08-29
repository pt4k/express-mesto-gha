const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');
const { NOTFOUND_ERROR_CODE } = require('../errors/errors');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные при создании карточки.');
      }
      res.status(201).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error('Карточка с указанным _id не найдена.');
      error.statusCode = NOTFOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new DefaultError('Ошибка по умолчанию');
      }
      res.send(cards);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
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
    .then((card) => {
      if (!card) {
        throw new DefaultError('Ошибка по умолчанию');
      }
      res.send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
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
    .then((card) => {
      if (!card) {
        throw new DefaultError('Ошибка по умолчанию');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
