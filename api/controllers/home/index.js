module.exports = {


  friendlyName: 'Index',


  description: 'Index home.',


  inputs: {

  },


  exits: {

  },


  fn: async function (_, exits) {

    return exits.success({ message: "You have reached myPadi web service" });

  }


};
