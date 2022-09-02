const router = require('express').Router();
const {
  getUser, getUsers, patchUser, patchAvatar,
  // getUserMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
// router.get('/users/me', getUserMe);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
