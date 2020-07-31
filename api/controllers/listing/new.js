module.exports = {


  friendlyName: 'New',


  description: 'New listing.',


  inputs: {
    name: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    rent: {
      type: 'string',
      required: true
    }
  },


  exits: {
    success: {},
    error: {}
  },


  fn: async function (inputs, exits) {

    try {
      let newListing = await Listing.create({
        id: sails.helpers.getUuid(),
        name: inputs.name,
        type: inputs.type,
        address: inputs.address,
        rent: inputs.rent,

        lister: this.req.me.id
      }).fetch();
      // All done.
      return exits.success({
        message: 'New listing created successfully',
        data: newListing,
      });

    } catch (error) {
      sails.log.error(error);
      return exits.error(error)
    }
  }
};
