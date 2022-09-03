const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidError = require('../errors/ValidError');
const ConflictError = require('../errors/ConflictError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const cardId = req.params.id;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным ID не найдена.');
    })
    .then((card) => {
      const cardOwner = card.owner.toString().replace('new ObjectId("', '');

      if (userId !== cardOwner) {
        throw new ConflictError('Невозможно удалить карточку другого пользователя.');
      }

      card.remove();

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные для удаления карточки.'));
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
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
      throw new NotFoundError('Карточка с указанным ID не найдена.');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные для выбора карточки.'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным ID не найдена.');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные для выбора карточки.'));
      }
      next(err);
    });
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
