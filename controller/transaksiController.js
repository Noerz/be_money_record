const db = require("../config/Database");
const initModels = require("../models/init-models");
const models = initModels(db);

// CREATE: Transaksi penambahan saldo
const addSaldo = async (req, res) => {
    try {
      const { idDompet, namaTransaksi, tanggal, jumlah, keterangan, idKategori } = req.body;
  
      const dompet = await models.dompet.findOne({ where: { idDompet } });
      if (!dompet) {
        console.log("Dompet not found");
        return res.status(404).json({
          code: 404,
          status: 'error',
          message: "Dompet not found"
        });
      }
  
      const newTransaksi = await models.transaksi.create({
        namaTransaksi,
        tanggal,
        jumlah,
        jenis: 'pemasukan',
        keterangan,
        idKategori,
        idDompet,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      await models.dompet.update(
        { saldo: dompet.saldo + jumlah, updatedAt: new Date() },
        { where: { idDompet } }
      );
  
      console.log("Saldo added successfully");
  
      res.status(201).json({
        code: 201,
        status: 'success',
        message: "Saldo added successfully",
        data: newTransaksi
      });
    } catch (error) {
      console.error("Error:", error.message); // Menggunakan console.error untuk mencetak error
      res.status(500).json({
        code: 500,
        status: 'error',
        message: error.message
      });
    }
  };
  
  
  const reduceSaldo = async (req, res) => {
    try {
      const { idDompet, namaTransaksi, tanggal, jumlah, keterangan, idKategori } = req.body;
  
      const dompet = await models.dompet.findOne({ where: { idDompet } });
      if (!dompet) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          message: "Dompet not found"
        });
      }
  
      if (dompet.saldo < jumlah) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          message: "Insufficient saldo"
        });
      }
  
      const newTransaksi = await models.transaksi.create({
        namaTransaksi,
        tanggal,
        jumlah,
        jenis: 'pengeluaran',
        keterangan,
        idKategori,
        idDompet,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      await models.dompet.update(
        { saldo: dompet.saldo - jumlah, updatedAt: new Date() },
        { where: { idDompet } }
      );
  
      res.status(201).json({
        code: 201,
        status: 'success',
        message: "Saldo reduced successfully",
        data: newTransaksi
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: 'error',
        message: error.message
      });
    }
  };
  
  // READ: Mendapatkan semua transaksi
  const getAllTransaksi = async (req, res) => {
    try {
      const allTransaksi = await models.transaksi.findAll();
      res.status(200).json({
        code: 200,
        status: 'success',
        message: "Transaksi retrieved successfully",
        data: allTransaksi
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: 'error',
        message: error.message
      });
    }
  };
  
  module.exports = { addSaldo, reduceSaldo, getAllTransaksi };
  