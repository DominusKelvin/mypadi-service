module.exports = async function (req, res, proceed) {
  try {
    await sails.helpers.verifyJwt(req);
    proceed();
  } catch (error) {
    sails.log(error.message);
    res.status(401).json({ error: error.message });
  }
};
