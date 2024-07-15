const express = require('express');

const{authRoutes} = require("./authRoute");
const{dompetRoutes} = require("./dompetRoute");
const{transaksiRoutes} = require("./transaksiRoute");


const router = express.Router();

authRoutes(router);
dompetRoutes(router);
transaksiRoutes(router);



module.exports = router;