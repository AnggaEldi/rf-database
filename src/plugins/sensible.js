"use strict";
const fastifyPlugin = require("fastify-plugin");

async function sensi(fastify) {
  fastify.register(require("@fastify/sensible"));
}

module.exports = fastifyPlugin(sensi);
