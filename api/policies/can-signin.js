module.exports = async function (req, res, proceed) {
    const { emailAddress } = req.allParams();
    try {
        const user = await User.findOne({ emailAddress: emailAddress });
        if (!user) {
            res.status(404).json({
                error: `${emailAddress} does not belong to a myPadi user`,
            });
        } else if (user.emailStatus == "unconfirmed") {
            res.status(401).json({
                error:
                    "This myPadi account has not been confirmed. Click on the link in the email sent to you to confirm.",
            });
        } else {
            proceed();
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};