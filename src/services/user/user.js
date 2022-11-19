"use strict";

const Request = require("tedious").Request;
const { TYPES } = require("tedious");
const { RF_USER } = require("../../constants/rf_user_table");

//user register service
const userRegister = async (fastify, req, reply) => {
  const mssql = fastify.mssql;
  const { id, password, email } = req.body;
  const register = new Request(
    ` INSERT INTO ${RF_USER.TBL_RFTESTACCOUNT} (id, password, email) 
      VALUES (@id, @password, @email)`,
    function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
    }
  );
  register.addParameter("id", TYPES.Binary, new Buffer(id));
  register.addParameter("password", TYPES.Binary, new Buffer(password));
  register.addParameter("email", TYPES.VarChar, email);
  await mssql.execSql(register);
};

const isUserExist = async (fastify, req, reply) => {
  return new Promise((resolve, reject) => {
    const { id } = req.body;
    console.log("is user id", id);
    const mssql = fastify.mssql;
    const checkUser = new Request(
      `SELECT id FROM ${RF_USER.TBL_RFTESTACCOUNT} WHERE id = @id`,
      (err, rowCount) => {
        if (err) {
          reject(err);
        } else {
          resolve(rowCount);
        }
      }
    );
    checkUser.addParameter("id", TYPES.Binary, new Buffer(id));
    mssql.execSql(checkUser);
  });
};

module.exports = { userRegister, isUserExist };
