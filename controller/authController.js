const db = require("../config/Database");
const initModels = require("../models/init-models");
const models = initModels(db);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const { fullName, email, password, role } = req.body;
        const hashPassword = await bcrypt.hash(password, salt);

        const createdUser = await models.user.create({
            fullName,
            email,
            password: hashPassword,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({ msg: "User registered successfully", data: createdUser });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await models.user.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Email not found",
                data: null,
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Incorrect password",
                data: null,
            });
        }

        const userId = user.idUser;
        const name = user.fullName;
        const accessToken = jwt.sign(
            { userId, name, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }  // Optional: set token expiration time
        );
        const result = {
            userId,
            name,
            email: user.email,
            role: user.role,
            accessToken,
        };

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: "error",
            message: error.message,
            data: null,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE_MAIL,
            host: process.env.HOST_MAIL,
            port: process.env.PORT_MAIL,
            secure: true,
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASS_MAIL,
            },
        });

        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: "Email is required" });
        if (!email.includes("@")) return res.status(400).json({ msg: "Invalid email format" });

        let password = "HIMTIF#";
        const characters = process.env.RANDOM_PASSWORD;
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            password += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await models.user.update({ password: hashedPassword }, { where: { email } });

        const mailOptions = {
            from: process.env.USER_MAIL,
            to: email,
            subject: "Reset Password",
            text: `Your new password: ${password}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = { Register, login, resetPassword };
