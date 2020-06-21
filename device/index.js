const express = require('express');
const cors = require('cors');
const { colorToStr } = require('./functions');

function sendState(req, res) {
  res.status(200).send(+on + ',' + colorToStr(color));

  console.log('Sent state', on, color);
}

const app = express();

let on = false;
let color = {
  r: 0, g: 0, b: 0,
};

app.use(cors());

app.get('/', sendState);

app.post('/', (req, res, next) => {
  let { on: newOn, r, g, b } = req.query;

  on = Boolean(parseInt(newOn));
  r = parseInt(r);
  g = parseInt(g);
  b = parseInt(b);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return res.status(400).send('');
  }

  color = { r, g, b };

  next();
}, sendState);

app.listen(80, () => console.log('Listening to requests on port 80'));
