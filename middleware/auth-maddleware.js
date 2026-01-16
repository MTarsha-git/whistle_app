const jwt = require('jsonwebtoken');

// Verify Bearer token and attach user info to req
// Used in routes to protect endpoints
//
module.exports = function authMiddleware(req, res, next) {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Authorization header missing or malformed' });
	}

	const token = authHeader.slice(7);
	const secret = process.env.JWT_SECRET || 'dev_whistle_secret_change_me';

	try {
		const payload = jwt.verify(token, secret);
		// attach basic payload to request for downstream handlers
		req.user = { id: payload.id, RoleId: payload.RoleId };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}
