const { ITEM_KIND } = require("../constants/item");

const userRegister = {
  description: "User register schema",
  type: "object",
  properties: {
    id: { type: "string" },
    password: { type: "string" },
    email: { type: "string" },
  },
  required: ["id", "password"],
};

module.exports = { userRegister };
