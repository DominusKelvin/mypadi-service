const jwt = require("jsonwebtoken");
module.exports = {
  friendlyName: "Issue jwt",

  description: "",

  sync: true,

  inputs: {
    payload: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: function (inputs) {
    const key = "mypadi";
    const token = jwt.sign(inputs.payload, key);

    return token;
  },
};
