// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'http://pishchenko.mesto.students.nomoredomains.sbs',
  'https://pishchenko.mesto.students.nomoredomains.sbs',
  'localhost:3005',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
  // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  // устанавливаем заголовок, который разрешает браузеру запросы из любого источника
  res.header('Access-Control-Allow-Origin', '*');

  next();
};
