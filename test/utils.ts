import express, {
  ErrorRequestHandler,
  Express,
  json as bodyParser
} from 'express';
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { Server } from 'node:http';

export const getExpressApp = (): Express => {
  const app = express();

  app.use(bodyParser());

  app.post('/ping-pong', (req, res) => {
    console.log('Server has acknowledged request', req.ip);
    res.json({
      message: 'Success!',
      body: req.body,
      query: req.query
    });
  });

  app.get('/redirect', async (req, res) => {
    res.redirect(301, 'https://www.google.com');
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

export const getFastifyApp = (): Server => {
  const fastify = Fastify({
    logger: true
  });

  fastify.get('/api', async (request, reply) => {
    reply.send({
      message: 'Success!',
      body: request.body,
      query: request.query
    });
  });

  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      console.error(error.stack);
      reply.send({
        message: 'Internal Server Error!'
      });
    }
  );

  return fastify.server;
};
