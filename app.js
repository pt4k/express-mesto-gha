const mongoose = require('mongoose');
const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOTFOUND_ERROR_CODE } = require('./errors/errors');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62f90a9df57ff4b01b5f1330',
  };

  next();
});

app.use('/', usersRouter, cardsRouter);

app.use((req, res) => {
  res.status(NOTFOUND_ERROR_CODE).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
