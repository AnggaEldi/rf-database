"use strict";
const fastifyPlugin = require("fastify-plugin");
const Connection = require("tedious").Connection;

async function tediousConnector(fastify, opts, next) {
  fastify.decorate("mssql", (dbName, sql, callback) => {
    const { MSSQL_SERVER_NAME, MSSQL_USER, MSSQL_PWD } = fastify.config;
    const config = {
      server: MSSQL_SERVER_NAME,
      options: { tdsVersion: "7_1", encrypt: false, database: dbName },
      authentication: {
        type: "default",
        options: {
          userName: MSSQL_USER,
          password: MSSQL_PWD,
        },
      },
    };
    const connection = new Connection(config);
    connection.connect((err) => {
      if (err) return callback(err, null);
      connection.execSql(sql);
    });
  });
  next();
}

module.exports = fastifyPlugin(tediousConnector, { name: "mssql" });
