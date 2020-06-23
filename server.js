require('./models/User');
require('./models/Product');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const product = require('./routes/products');
const db = 'mongodb://mongo/disxt-testdb';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(auth);
app.use(product);

mongoose.Promise = global.Promise;
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection
  .once('open', () => console.log('Connected to Mongo instance'))
  .on('error', (error) => console.log('Error connecting to MongoDB', error));

module.exports = app;
