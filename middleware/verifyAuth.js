const jwt = require("jsonwebtoken");
const db = require("../config/Database");
const initModels = require("../models/init-models");
const models = initModels(db);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.decoded = decoded;
        console.log(decoded);
        next();
    });
};

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await models.user.findOne({ where: { email: decoded.email } });

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ msg: "Hanya admin yang dapat mengakses" });
        }

        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

module.exports = { verifyToken, isAdmin };
