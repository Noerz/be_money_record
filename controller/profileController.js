const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const getProfile = async (req, res) => {
  try {
    const { user_id } = req.decoded;
    const response = await models.user.findOne  ({
      where: {
        idUser: user_id,
      },
    });

    if (response.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Profile tidak ditemukan",
        data: null,
      });
    }
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.decoded;
    const { fullName, adress, noHp, gender } = req.body;
    await models.user.update(
      { fullName, adress, noHp, gender },
      { where: { idUser: user_id } }
    );
    res.status(200).json({ msg: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { user_id } = req.decoded;
    const { oldPassword, newPassword } = req.body;

    const user = await models.user.findOne({
      where: { idUser: user_id },
      include: [{ model: models.auth, as: "auth" }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.auth.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await models.auth.update(
      { password: hashedPassword },
      { where: { idAuth: user.auth_id } }
    );

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { user_id } = req.decoded;
    const { file } = req; // Assuming you're using multer for file uploads

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", file.filename);

    // Get the current user data
    const user = await models.user.findOne({ where: { idUser: user_id } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the old profile picture if exists
    if (user.image) {
      const oldImagePath = path.join(__dirname, "../uploads", user.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the profile picture path in the database
    await models.user.update(
      { image: file.filename },
      { where: { idUser: user_id } }
    );

    res.status(200).json({ msg: "Profile picture updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const { user_id } = req.decoded;
    const user = await models.user.findOne({ where: { idUser: user_id } });

    if (!user || !user.image) {
      return res.status(404).json({ msg: "Profile picture not found" });
    }

    const filePath = path.join(__dirname, "../uploads", user.image);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture,
  getProfilePicture,
};
