const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create entry in the auth table
    const newAuth = await models.auth.create({
      email,
      password: hashPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // If auth entry is created successfully, use the returned idAuth to create user entry
    if (newAuth) {
      const newUser = await models.user.create({
        fullName,
        auth_id: newAuth.idAuth,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res
        .status(201)
        .json({ msg: "User registered successfully", data: newUser });
    } else {
      res.status(400).json({ msg: "Failed to create auth entry" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = await models.auth.findOne({ where: { email } });

    // Check if the auth record was found
    if (!auth) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Email not found",
        data: null,
      });
    }

    // Now check the password
    const match = await bcrypt.compare(password, auth.password);
    if (!match) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Incorrect password",
        data: null,
      });
    }

    // Since auth exists, we can now safely find the user
    const user = await models.user.findOne({ where: { auth_id: auth.idAuth } });
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    // Create access token
    const accessToken = jwt.sign(
      { user_id: user.idUser, email: auth.email, role: auth.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Optional: set token expiration time
    );

    const result = {
      userId: user.idUser,
      email: auth.email,
      role: auth.role,
      accessToken: accessToken,
    };

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login Error:", error);
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
    if (!email.includes("@"))
      return res.status(400).json({ msg: "Invalid email format" });

    let password = "HIMTIF#";
    const characters = process.env.RANDOM_PASSWORD;
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await models.user.update(
      { password: hashedPassword },
      { where: { email } }
    );

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
