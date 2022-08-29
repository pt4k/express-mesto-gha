const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const err = require('./middlewares/errors');
const { NOTFOUND_ERROR_CODE, AUTH_ERROR_CODE } = require('./errors/errors');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', usersRouter, cardsRouter);

app.use((req, res) => {
  res.status(AUTH_ERROR_CODE).send({ message: 'Необходима авторизация' });
});
app.use((req, res) => {
  res.status(NOTFOUND_ERROR_CODE).send({ message: 'Страница по указанному маршруту не найдена' });
});
app.use(err);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
