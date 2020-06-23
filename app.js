const app = require('./server');

const PORT = process.env.PORT || 5000;

const start = () => {
  if (process.env.JWT_SECRET) {
    app.listen(PORT, () => {
      console.log('Listening to port', PORT);
    });
  } else {
    console.log('Please ensure that environment variables are present');
  }
};

start();
