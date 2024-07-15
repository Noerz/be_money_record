const express = require("express");
const router = express.Router();
const { createDompet, getAllDompet, getDompetById, updateDompet, deleteDompet } = require("../controller/dompetController");

const dompetRoutes = (router) => {
    router.post("/dompet", createDompet);
    router.get("/dompet", getAllDompet);
    router.get("/dompet/:idDompet", getDompetById);
    router.put("/dompet/:idDompet", updateDompet);
    router.delete("/dompet/:idDompet", deleteDompet);

}


module.exports={dompetRoutes}