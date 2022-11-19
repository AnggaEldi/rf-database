"use strict";

const fastifyEnv = require("@fastify/env");
const fastifyPlugins = require("fastify-plugin");

async function setConfig(fastify) {
  fastify.register(fastifyEnv, {
    confKey: "config",
    schema: {
      type: "object",
      properties: {
        APP_PORT: { type: "integer" },
        APP_MONGO_URI: { type: "string" },
        PAGINATION_ROW_PER_PAGE: { type: "integer" },
        MSSQL_SERVER_NAME: { type: "string" },
        MSSQL_USER: { type: "string" },
        MSSQL_PWD: { type: "string" },
      },
    },
    dotenv: true,
  });
}

module.exports = fastifyPlugins(setConfig);
