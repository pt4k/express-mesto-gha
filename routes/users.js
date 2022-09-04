const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUser, getUsers, patchUser, patchAvatar, getUserMe,
} = require('../controllers/users');

const urlRegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserMe);
router.get('/users/:id', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp),
  }),
}), patchAvatar);

module.exports = router;
