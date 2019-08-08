const express = require('express');
const cors = require('cors');

const app = express();

const color = {
  r: 0, g: 0, b: 0,
};

function colorToStr(color) {
  return color.r + ',' + color.g + ',' + color.b;
}

function sendState(req, res) {
  res.status(200).send(colorToStr(color));

  console.log('Sent state', color);
}

app.use(cors());

app.get('/', sendState);

app.post('/', (req, res, next) => {
  let { r, g, b } = req.query;

  r = parseInt(r);
  g = parseInt(g);
  b = parseInt(b);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return res.status(400).send('');
  }

  color.r = r;
  color.g = g;
  color.b = b;

  next();
}, sendState);

app.listen(80, console.log('Listening to requests on port 80'));
