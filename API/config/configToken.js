/*
    ref : jsonwebtoken
	web : https://github.com/auth0/node-jsonwebtoken
	jwtSerect is key security
	jwtExpiresIn time out of token default 1 minutes
	ex : jwtExpiresIn have unit : m : minutes,h : hours
 */
const TokenConfig = {
	jwtSerect: "jwt",
	jwtExpiresIn: "24h"
};
module.exports = { TokenConfig };