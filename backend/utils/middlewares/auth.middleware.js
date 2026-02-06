
const User = require("../../src/models/User")
const { verify } = require("../libs/jwt.lib");


const getToken = (req) => {
    const authorization = req.header('Authorization');
    if (authorization) {
        const token = authorization.split(' ')[1];
        return token;
    }

    return null;
}

const isLogin =async (req, res, next) => {
    try {
        const token = getToken(req);
        if (!token) {
            return res.status(401).json ({
                message: "Unauthorized, token is missing"
            })
        }

        const verifyToken = verify(token);
        if (!verifyToken) {
            return res.status(401).json({
                message: "Unauthorized, invalid token"
            })
        }

        const id = verifyToken.id;
        const user = await User.findById(id).select('_id first_name last_name')
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized, user not found"
            })
        }

        req.user = user;
        next();
    } catch (error) {

        

        return res.status(500).json({
            message: "Internal Server Error, please retry later !!!"
        })
    }
};

module.exports = { isLogin };