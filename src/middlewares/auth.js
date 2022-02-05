const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
	const token = req.body.token || req.headers["access-token"];
	
	if (!token) {
		return res.status(403).json({message: "error in authenticationl"});
	}

	try {
		const decode = jwt.verify(token, process.env.KEY_TOKEN);
		req.id_user = decode.id;

		const newToken = jwt.sign({id: decode.id}, process.env.KEY_TOKEN, {
			expiresIn: "4h"
		});

		res.setHeader('access-token', newToken);

	} catch (e) {
		return res.status(401).json({message: "invalid token"});
	}

	return next();
}

module.exports = verifyToken;
