const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    const { user_id } = req.decoded;
    const response = await models.user.findAll({
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

module.exports = {
  getProfile,
  updateProfile
};
