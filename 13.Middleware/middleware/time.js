const middleware1 = (req, res, next) => {
    req.currentTime = new Date().toISOString();
    next();
}

module.exports = middleware1