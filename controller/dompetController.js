const db = require("../config/Database");
const initModels = require("../models/init-models");
const models = initModels(db);

// CREATE: Menambahkan dompet baru
const createDompet = async (req, res) => {
  try {
    const { nama, target, saldo, idUser } = req.body;
    const newDompet = await models.dompet.create({
      nama,
      target,
      saldo,
      idUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({
      code: 201,
      status: "success",
      message: "Dompet created successfully",
      data: newDompet,
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

// READ: Mendapatkan semua dompet
const getDompet = async (req, res) => {
  try {
    const { id } = req.query;
    const whereCondition = {};

    if (id) {
      whereCondition.idDompet = id;
    }
    const response = await models.dompet.findAll({ where: whereCondition });
    if (response.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Dompet tidak ditemukan",
        data: null,
      });
    }
    res.status(200).json({
      code: 200,
      status: "success",
      message: "All dompets retrieved successfully",
      data: response,
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

// READ: Mendapatkan dompet berdasarkan idUser
const getDompetByIdUser = async (req, res) => {
  try {
    const { idUser } = req.query;
    if (!idUser) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idUser is required",
        data: null,
      });
    }

    const response = await models.dompet.findAll({ where: { idUser } });
    if (response.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Dompet tidak ditemukan",
        data: null,
      });
    }
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Dompets retrieved successfully",
      data: response,
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

// UPDATE: Mengubah dompet berdasarkan idDompet
const updateDompet = async (req, res) => {
  const dompet = await models.dompet.findOne({ where: { idDompet: req.query.id } });
  if (!dompet) return res.status(404).json({ msg: "Dompet tidak ditemukan" });

  const body = {
    nama: req.body.nama,
    target: req.body.target,
    saldo: req.body.saldo,
    updatedAt: new Date(),
  };
  try {
    await models.dompet.update(body, { where: { idDompet: req.query.id } });
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Dompet updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// DELETE: Menghapus dompet berdasarkan idDompet
const deleteDompet = async (req, res) => {
  try {
    const { idDompet } = req.params;
    const deletedDompet = await models.dompet.destroy({ where: { idDompet } });
    if (!deletedDompet) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Dompet not found",
      });
    }
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Dompet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createDompet,
  getDompet,
  getDompetByIdUser, // Export fungsi baru
  updateDompet,
  deleteDompet,
};
