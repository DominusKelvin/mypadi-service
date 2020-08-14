module.exports = {


  friendlyName: 'Update',


  description: 'Update a listing.',


  inputs: {
    id: {
      type: "string",
      required: true
    },
    name: {
      type: "string",
      required: true
    },
    type: {
      type: "string",
      required: true
    },
    address: {
      type: "string",
      required: true
    },
    rent: {
      type: "string",
      required: true
    }
  },


  exits: {
    success: {
      description: "Successful"
    },
    notAuthorized: {
      description: "Not authorized"
    }
  },


  fn: async function (inputs, exits) {
    // //First get the ID of the logged in user
    // let userId = this.req.me.id;

    // //Find the particular listing to be updated
    // let listing = await Listing.findOne({id: inputs.id})

    // //Now check if the listing found above has same lister value as the userId
    // if(listing.lister != userId)
    // return exits.notAuthorized({
    //   message: "You are not authorized to make this request",
    // })

    //So edit the listing since it belongs to this currecnt logged in user
    const updatedListing = await Listing.update({ id: inputs.id }).set({
      name: inputs.name,
      address: inputs.address,
      type: inputs.type,
      rent: inputs.rent
    }).fetch();
    return exits.success({
      message: "Listing was successfully updated",
      data: updatedListing
    })

  }

};
