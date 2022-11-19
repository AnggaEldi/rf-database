"use strict";

const Request = require("tedious").Request;
const { TYPES } = require("tedious");
const { DB } = require("../../constants/rf_db");
const { RF_BILLING_TABLE } = require("../../constants/rf_table");

const userCreateBilling = async (fastify, id, premiumDay, cash) => {
  return new Promise((resolve, reject) => {
    const createBilling = new Request(
      ` INSERT INTO ${RF_BILLING_TABLE.TBL_USERSTATUS}
        ( id, status, DTStartPrem, DTEndPrem, Cash ) 
        VALUES ( 
          @id, 
          '2', 
          CONVERT(datetime, GETDATE()), 
          CONVERT(datetime, GETDATE()+${premiumDay}), 
          @Cash )
      `,
      function (err) {
        if (err) {
          throw err;
        }
      }
    );
    createBilling.addParameter("id", TYPES.VarChar, id);
    createBilling.addParameter("Cash", TYPES.Int, cash);
    createBilling.on("requestCompleted", () => resolve(true));
    fastify.mssql(DB.RF_BILLING, createBilling);
  });
};

const userInsertCash = async (fastify, id, cash) => {
  return new Promise(async (resolve, reject) => {
    const userBilling = await userGetBilling(fastify, id);
    if (!userBilling.length) {
      reject({ message: "User billing not found." });
      return false;
    }
    const insertCash = new Request(
      ` UPDATE ${RF_BILLING_TABLE.TBL_USERSTATUS} 
        SET [Cash] = @cash
        WHERE id = @id
      `,
      function (err) {
        if (err) {
          reject(err);
        }
      }
    );
    insertCash.on("requestCompleted", function () {
      resolve(true);
    });
    insertCash.addParameter("cash", TYPES.Int, userBilling[0].Cash + cash);
    insertCash.addParameter("id", TYPES.VarChar, id);
    fastify.mssql(DB.RF_BILLING, insertCash);
  });
};

const userGetBilling = async (fastify, id) => {
  return new Promise((resolve, reject) => {
    let result = [];
    const getBilling = new Request(
      ` SELECT * FROM ${RF_BILLING_TABLE.TBL_USERSTATUS}
        WHERE id = @id
      `,
      function (err) {
        if (err) throw err;
      }
    );
    getBilling.addParameter("id", TYPES.VarChar, id);
    getBilling.on("row", (columns) => {
      const entry = {};
      columns.forEach((column) => {
        entry[column.metadata.colName] = column.value;
      });
      result.push(entry);
    });
    getBilling.on("requestCompleted", function () {
      resolve(result);
    });
    fastify.mssql(DB.RF_BILLING, getBilling);
  });
};

module.exports = { userCreateBilling, userGetBilling, userInsertCash };
