"use strict";

const userService = require("../../services/user/user");
const { msg } = require("../../constants/messages");

module.exports = async function (fastify) {
  const { userRegister } = require("../../schemas/user");
  fastify.post("/register", {
    schema: { body: userRegister },
    handler: async function (request, reply) {
      const isUserExist = await userService.isUserExist(fastify, request);
      if (isUserExist > 0) {
        return reply.code(200).send({
          message: msg.FAIL_USER_DUPLICATE,
        });
      }
      const register = await userService.userRegister(fastify, request);
      if (!register) {
        reply.code(201).send({
          message: msg.SUCCESS_USER_CREATE,
        });
      }
    },
  });
};
