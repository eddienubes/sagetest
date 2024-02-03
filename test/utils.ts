import express, { ErrorRequestHandler, Express } from 'express';

const getExpressServer = (): Express => {
  const app = express();
  app.post('/api', (req, res) => {
    console.log('Server has acknowledged request', req.ip);
    res.json({ message: 'Success!' });
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error!'
    });
  };

  app.use(errorHandler);

  return app;
};
