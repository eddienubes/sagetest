import express, { json as bodyParser } from 'express';
import multer from 'multer';

export const createApp = () => {
  const app = express();

  app.use(bodyParser());

  app.post('/ping-pong', (req, res) => {
    res.json({
      message: 'Success!',
      body: req.body,
      query: req.query,
      reqHeaders: req.headers
    });
  });

  const upload = multer({ storage: multer.memoryStorage() });
  app.post(
    '/upload',
    upload.fields([{ name: 'picture', maxCount: 1 }]),
    (req, res) => {
      res.json({
        message: 'Success!',
        body: req.body,
        query: req.query,
        files: req.files,
        reqHeaders: req.headers
      });
    }
  );

  return app;
};
