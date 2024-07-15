const express = require("express");
const router = express.Router();
const { addSaldo, reduceSaldo,getAllTransaksi } = require("../controller/transaksiController");

const transaksiRoutes = (router) => {
    router.get("/transaksi", getAllTransaksi);
    router.post("/transaksi/pemasukan", addSaldo);
    router.post("/transaksi/pengeluaran", reduceSaldo);

}


module.exports={transaksiRoutes}