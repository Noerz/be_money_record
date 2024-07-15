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
      updatedAt: new Date()
    });
    res.status(201).json({
      code: 201,
      status: 'success',
      message: "Dompet created successfully",
      data: newDompet
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.message
    });
  }
};

// READ: Mendapatkan semua dompet
const getAllDompet = async (req, res) => {
  try {
    const allDompet = await models.dompet.findAll();
    res.status(200).json({
      code: 200,
      status: 'success',
      message: "All dompets retrieved successfully",
      data: allDompet
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.message
    });
  }
};

// READ: Mendapatkan satu dompet berdasarkan idDompet
const getDompetById = async (req, res) => {
  try {
    const { idDompet } = req.params;
    const dompet = await models.dompet.findOne({ where: { idDompet } });
    if (!dompet) {
      return res.status(404).json({
        code: 404,
        status: 'error',
        message: "Dompet not found"
      });
    }
    res.status(200).json({
      code: 200,
      status: 'success',
      message: "Dompet retrieved successfully",
      data: dompet
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.message
    });
  }
};

// UPDATE: Mengubah dompet berdasarkan idDompet
const updateDompet = async (req, res) => {
  try {
    const { idDompet } = req.params;
    const { nama, target, saldo } = req.body;
    const updatedDompet = await models.dompet.update(
      { nama, target, saldo, updatedAt: new Date() },
      { where: { idDompet } }
    );
    if (updatedDompet[0] === 0) {
      return res.status(404).json({
        code: 404,
        status: 'error',
        message: "Dompet not found"
      });
    }
    res.status(200).json({
      code: 200,
      status: 'success',
      message: "Dompet updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.message
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
        status: 'error',
        message: "Dompet not found"
      });
    }
    res.status(200).json({
      code: 200,
      status: 'success',
      message: "Dompet deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createDompet, getAllDompet, getDompetById, updateDompet, deleteDompet };
