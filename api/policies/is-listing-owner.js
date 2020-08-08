module.exports = async function (req, res, proceed) {
    try {
        const transaction = await Listing.findOne({ id: req.params.id });
        if (req.me.id == Listing.lister) {
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
