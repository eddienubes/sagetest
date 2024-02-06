import express, { ErrorRequestHandler, Express } from 'express';
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { Server } from 'node:http';

export const getExpressApp = (): Express => {
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

export const getFastifyApp = (): Server => {
  const fastify = Fastify({
    logger: true
  });

  fastify.get('/api', async (request, reply) => {
    reply.send({ message: 'Success!' });
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
