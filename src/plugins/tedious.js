"use strict";
const fastifyPlugin = require("fastify-plugin");
const Connection = require("tedious").Connection;

async function tediousConnector(fastify, opts, next) {
  console.log('OPTS', opts);
  const { MSSQL_SERVER_NAME, MSSQL_USER, MSSQL_PWD } = fastify.config;
  const config = {
    server: MSSQL_SERVER_NAME,
    options: { tdsVersion: "7_1", encrypt: false, database: "RF_User" },
    authentication: {
      type: "default",
      options: {
        userName: MSSQL_USER,
        password: MSSQL_PWD,
      },
    },
  };
  const connection = new Connection(config);
  await connection.connect((err) => {
    if (err) {
      console.log("Connection Failed");
      throw err;
    } 
    console.log('db konek');
  });
  fastify.decorate("mssql", connection);
  next();
}

module.exports = fastifyPlugin(tediousConnector, { name: "mssql" });
