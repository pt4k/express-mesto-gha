const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidError = require('../errors/ValidError');
const NotAvailable = require('../errors/NotAvailable');

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
      } else {
        next(err);
      }
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
        throw new NotAvailable('Невозможно удалить карточку другого пользователя.');
      }

      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные для удаления карточки.'));
      } else {
        next(err);
      }
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
    { $addToSet: { likes: req.user._id } },
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
      } else {
        next(err);
      }
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
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
