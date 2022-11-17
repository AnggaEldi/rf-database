"use strict";
const fastifyPlugin = require("fastify-plugin");

async function dbConnector(fastify) {
  fastify.register(require("@fastify/mongodb"), {
    forceClose: true,
    url: fastify.config.APP_MONGO_URI,
  });
}

module.exports = fastifyPlugin(dbConnector);
