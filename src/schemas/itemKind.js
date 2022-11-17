const { ITEM_KIND } = require("../constants/item");

const itemKinds = {
  description: "Item kind validator",
  type: "object",
  properties: {
    itemKind: { enum: ITEM_KIND },
  },
  required: ["itemKind"],
};

module.exports = { itemKinds };
