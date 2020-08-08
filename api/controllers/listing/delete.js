module.exports = {


  friendlyName: 'Delete',


  description: 'Delete a listing.',


  inputs: {
    id: {
      type: "string"
    }
  },


  exits: {
    success: {
      description: "Successfully deleted"
    },
    invalidRequest: {
      description: "Invalid request"
    },
    unauthorized: {
      description: "Not authorized"
    }
  },


  fn: async function (inputs, exits) {
    try {
      await Listing.destroy({ id: inputs.id });
      return exits.success({
        message: "Listing successfully deleted"
      })

    } catch (error) {

    }
  }
};
