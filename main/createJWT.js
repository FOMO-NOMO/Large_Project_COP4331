const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (fn, ln, id) {
    return _createToken(fn, ln, id);
}

function _createToken(fn, ln, id) {
    let user = null;
    try {
        user = { userId: id, firstName: fn, lastName: ln };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        return { accessToken };
    } catch (e) {
        return { error: e.message, user_info: user };
    }
}

exports.isExpired = function(token) {
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return false;
    } catch (err) {
        return true;
    }
}

exports.refresh = function(token) {
    const ud = jwt.decode(token, { complete: true });
    // Use correct payload keys
    const payload = ud ? ud.payload : {};
    const userId = payload.userId;
    const firstName = payload.firstName;
    const lastName = payload.lastName;
    return _createToken(firstName, lastName, userId);
}