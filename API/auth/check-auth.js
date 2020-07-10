const jwt = require("jsonwebtoken");
const _configToken = require("../config/configToken");
const configToken = _configToken.TokenConfig;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, configToken.jwtSerect);
        next();
    } catch (error) {
        const result = {
            status: false,
            message: "Auth failed!"
        };
        res.status(401).json(result);
    }
};