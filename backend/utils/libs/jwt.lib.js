const jwt = require('jsonwebtoken')
const KEY = process.env.SECRET_JWT_KEY;

const sign = (data) => {
    return jwt.sign(data, KEY);
};

const verify = (token) => {
    try {
        console.log('Your Token: ', token)
        return jwt.verify(token, KEY);
    } catch (err) {
        console.log('JWT VERIFY ERROR: ', error);
        return null;
    }
};

module.exports = { sign, verify };