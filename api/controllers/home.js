module.exports = {
  friendlyName: "Home",

  description: "Home something.",

  inputs: {},

  exits: {
    success: {
      description: "Everything went well",
    },
  },

  fn: async function (inputs, exits) {
    // All done.
    exits.success({ message: "You have reached myPadi web service" });
  },
};
