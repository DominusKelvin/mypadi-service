const { v4: uuidv4 } = require("uuid");
module.exports = {
  friendlyName: "Get uuid",

  sync: true,

  description: "",

  inputs: {},

  exits: {
    success: {
      outputFriendlyName: "Uuid",
    },
  },

  fn: function (inputs) {
    // Get uuid.
    let uuid = uuidv4();
    // TODO

    // Send back the result through the success exit.
    return uuid;
  },
};
