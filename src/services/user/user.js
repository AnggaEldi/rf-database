"use strict";

const Request = require("tedious").Request;
const { TYPES } = require("tedious");
const { DB } = require("../../constants/rf_db");
const { RF_USER_TABLE } = require("../../constants/rf_table");
const { userCreateBilling } = require("./billing");

//user register service
const userRegister = async (fastify, req) => {
  return new Promise(async (resolve, reject) => {
    const { id, password, email } = req.body;
    const { REGISTER_REWARD_PREM_DAY, REGISTER_REWARD_CASH } = fastify.config;
    const register = new Request(
      ` INSERT INTO ${RF_USER_TABLE.TBL_RFTESTACCOUNT} (id, password, email) 
        VALUES (@id, @password, @email)`,
      function (err, rowCount) {
        if (err) {
          reject(err);
        } else {
          resolve(rowCount);
        }
      }
    );
    register.addParameter("id", TYPES.Binary, new Buffer(id));
    register.addParameter("password", TYPES.Binary, new Buffer(password));
    register.addParameter("email", TYPES.VarChar, email);
    register.on("requestCompleted", async () => {
      // creating billing after success creating account
      await userCreateBilling(
        fastify,
        id,
        REGISTER_REWARD_PREM_DAY,
        REGISTER_REWARD_CASH
      ).catch((err) => {
        throw err;
      });
    });
    fastify.mssql(DB.RF_USER, register, async (err) => {
      if (err) throw err;
    });
  });
};

const isUserExist = async (fastify, req) => {
  return new Promise(async (resolve, reject) => {
    const { id } = req.body;
    const checkUser = new Request(
      `SELECT id FROM ${RF_USER_TABLE.TBL_RFTESTACCOUNT} WHERE id = @id`,
      (err, rowCount) => {
        if (err) {
          reject(err);
        } else {
          resolve(rowCount);
        }
      }
    );
    checkUser.addParameter("id", TYPES.Binary, new Buffer(id));
    fastify.mssql(DB.RF_USER, checkUser, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  });
};

const getAllUser = async (fastify) => {
  return new Promise(async (resolve, reject) => {
    let result = [];
    const allUser = new Request(
      `SELECT 
        CONVERT(VARCHAR, id) AS id , 
        CONVERT(VARCHAR, password) AS password, 
        email FROM ${RF_USER_TABLE.TBL_RFTESTACCOUNT}`,
      (err) => {
        if (err) reject(err);
      }
    );

    allUser.on("row", (columns) => {
      const entry = {};
      columns.forEach((column) => {
        entry[column.metadata.colName] = column.value;
      });
      result.push(entry);
    });

    allUser.on("requestCompleted", function () {
      resolve(result);
    });

    fastify.mssql(DB.RF_USER, allUser, (err, data) => {
      if (err) throw err;
    });
  });
};

module.exports = { userRegister, isUserExist, getAllUser };
