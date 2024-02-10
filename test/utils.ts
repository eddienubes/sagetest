import express, {
  ErrorRequestHandler,
  Express,
  json as bodyParser
} from 'express';
import Fastify, {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from 'fastify';
import multer from 'multer';
import { fastifyMultipart } from '@fastify/multipart';

export const getExpressApp = (): Express => {
  const app = express();

  app.use(bodyParser());

  app.post('/ping-pong', (req, res) => {
    // console.log('Server has acknowledged request', req.ip);
    res.json({
      message: 'Success!',
      body: req.body,
      query: req.query,
      reqHeaders: req.headers
    });
  });

  app.get('/redirect', async (req, res) => {
    res.redirect(301, 'https://www.google.com');
  });

  const upload = multer({ dest: 'test/fixtures/temp' });
  app.post(
    '/upload',
    upload.fields([{ name: 'picture', maxCount: 1 }]),
    (req, res) => {
      // console.log(
      //   'Server has received file',
      //   util.inspect(req.files, { depth: null })
      // );

      res.json({
        message: 'Success!',
        body: req.body,
        query: req.query,
        files: req.files,
        reqHeaders: req.headers
      });
    }
  );

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error!',
      body: req.body,
      query: req.query,
      reqHeaders: req.headers
    });
  };

  app.use(errorHandler);

  return app;
};

export const getFastifyApp = (): FastifyInstance => {
  const fastify = Fastify({
    logger: true
  });

  fastify.register(fastifyMultipart);

  fastify.post('/ping-pong', async (request, reply) => {
    reply.send({
      message: 'Success!',
      body: request.body || {},
      query: request.query || {},
      reqHeaders: request.headers
    });
  });

  fastify.get('/redirect', async (request, reply) => {
    reply.redirect(301, 'https://www.google.com');
  });

  fastify.post('/upload', async (request, reply) => {
    // console.log(
    //   'Server has received file',
    //   util.inspect(request.body, { depth: null }),
    //   util.inspect(request.files, { depth: null })
    // );

    const files = [];
    const filesIterator = request.files({
      limits: {
        fileSize: 1024 * 1000 * 1000000 // 1gb
      }
    });

    for await (const file of filesIterator) {
      const buffer = await file.toBuffer();

      files.push({
        fieldname: file.fieldname,
        filename: file.filename,
        encoding: file.encoding,
        mimetype: file.mimetype,
        fieldsCount: Object.keys(file.fields).length,
        size: buffer.length
      });
    }

    reply.send({
      message: 'Success!',
      body: request.body || {},
      query: request.query || {},
      files: files,
      reqHeaders: request.headers
    });
  });

  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      console.error(error.stack);
      reply.send({
        message: 'Internal Server Error!',
        body: request.body || {},
        query: request.query || {},
        reqHeaders: request.headers
      });
    }
  );

  return fastify;
};
