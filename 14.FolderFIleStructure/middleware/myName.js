const middleware2 = (req, res, next) => {
    req.myName = "Muhammad Mairaj";
    next();
}

module.exports = middleware2;