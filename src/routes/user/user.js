"use strict";

const userService = require("../../services/user/user");
const { msg } = require("../../constants/messages");

module.exports = async function (fastify) {
  const { userRegister } = require("../../schemas/user");
  fastify.post("/register", {
    schema: { body: userRegister },
    handler: async function (request, reply) {
      const userData = await userService.isUserExist(fastify, request);
      if (userData > 0) {
        return reply.code(200).send({
          message: msg.USER_CREATE_FAIL_DUPLICATED,
        });
      }
      const register = await userService.userRegister(fastify, request);
      if (!register) {
        return reply.send({
          message: msg.USER_CREATE_FAIL,
        });
      }
      reply.send({ message: msg.USER_CREATE_SUCCESS });
    },
  });

  fastify.get("/all", {
    handler: async function (req, reply) {
      const userData = await userService.getAllUser(fastify);
      console.log("udata", userData);
      reply.send({ message: "OK", data: userData });
    },
  });
};
