"use strict";

module.exports = async function (fastify) {
  const { itemKinds } = require("../../schemas/itemKind");

  fastify.get("/:itemKind", {
    schema: { params: itemKinds },
    handler: async function (request, reply) {
      const prefix = "item_"; // to add _items to itemkind to map database
      const { next } = request.query;
      const { itemKind } = request.params;
      const items = fastify.mongo.db.collection(prefix + itemKind);
      const result = fastify.paginator(request, reply, {
        collection: items,
        queries: {},
        next: next,
      });
      return result;
    },
  });
};
