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
          reject(err);
        }
      }
    );
    createBilling.addParameter("id", TYPES.VarChar, id);
    createBilling.addParameter("Cash", TYPES.Int, cash);
    createBilling.on("requestCompleted", () => resolve(true));
    fastify.mssql(DB.RF_BILLING, createBilling);
  });
};

module.exports = { userCreateBilling };
