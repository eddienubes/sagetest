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
import fastifyCookie from '@fastify/cookie';
import fs from 'node:fs';

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

  app.get('/cookie', (req, res) => {
    res.cookie('name', 'express');
    res.cookie('name', 'I love my mom!', { httpOnly: true }).json({
      message: 'Success!',
      body: req.body,
      query: req.query,
      files: req.files,
      reqHeaders: req.headers
    });
  });

  app.get('/download', async (req, res, next) => {
    const stream = fs.createReadStream('test/fixtures/cat.jpg');
    res.setHeader('Content-Type', 'image/jpeg');
    stream.pipe(res);
  });

  app.get('/error', (req, res, next) => {
    next(new Error('This is a test error'));
  });

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
  fastify.register(fastifyCookie);

  fastify.post('/ping-pong', async (request, reply) => {
    return reply.send({
      message: 'Success!',
      body: request.body || {},
      query: request.query || {},
      reqHeaders: request.headers
    });
  });

  fastify.get('/redirect', async (request, reply) => {
    return reply.redirect('https://www.google.com', 301);
  });

  fastify.post('/upload', async (request, reply) => {
    const files: any[] = [];
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

    return reply.send({
      message: 'Success!',
      body: request.body || {},
      query: request.query || {},
      files: files,
      reqHeaders: request.headers
    });
  });

  fastify.get('/cookie', (request: FastifyRequest, reply: FastifyReply) => {
    reply.setCookie('name', 'fastify');
    reply.setCookie('love', 'my mom!', { httpOnly: true }).send({
      message: 'Success!',
      body: request.body,
      query: request.query,
      files: request.files,
      reqHeaders: request.headers
    });
  });

  fastify.get('/download', async (request, reply) => {
    const stream = fs.createReadStream('test/fixtures/cat.jpg');
    reply.header('Content-Type', 'image/jpeg');
    return reply.send(stream);
  });

  fastify.get('/error', () => {
    throw new Error('This is a test error');
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
