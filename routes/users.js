const router = require('express').Router();
const {
  createUser, getUser, getUsers, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
