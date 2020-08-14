module.exports = async function (req, res, proceed) {
    try {
        const listing = await Listing.findOne({ id: req.params.id });
        if (_.isUndefined(listing)) return res.status(404).json({ error: "This listing does not exist" })
        if (req.me.id == listing.lister) {
            proceed();
        } else {
            res
                .status(401)
                .json({ error: "Only listing owner can perform this action" });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
