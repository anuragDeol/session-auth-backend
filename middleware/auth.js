const isAuthenticated = (req, res, next) => {
    if(req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({
        message: 'Unauthorized. You don\'t seem to have access to this resource.'
    });
}

module.exports = { isAuthenticated };