"use strict";
const fastifyPlugin = require("fastify-plugin");
const MongoPaging = require("mongo-cursor-pagination");

async function paginator(fastify) {
  const { PAGINATION_ROW_PER_PAGE } = fastify.config || 10;
  fastify.decorate("paginator", async (_, reply, opts) => {
    const { collection, queries, next } = opts;
    try {
      const query = await MongoPaging.find(collection, {
        query: queries,
        limit: PAGINATION_ROW_PER_PAGE,
        next: next,
      });
      return {
        statusCode: 200,
        message: "OK",
        pagination: {
          hasPrevious: query.hasPrevious,
          previous: query.previous,
          hasNext: query.hasNext,
          next: query.next,
        },
        data: query.results,
      };
    } catch (err) {
      fastify.log.error(err);
      reply.internalServerError();
    }
  });
}

module.exports = fastifyPlugin(paginator);
