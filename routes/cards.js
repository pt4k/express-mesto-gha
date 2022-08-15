const router = require('express').Router();
const { createCard, deleteCard, getCards, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:id', deleteCard);
router.post('/cards', createCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
