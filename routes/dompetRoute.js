const express = require("express");
const router = express.Router();
const {
  createDompet,
  getDompet,
  getDompetByIdUser,
  updateDompet,
  deleteDompet,
} = require("../controller/dompetController");
const { verifyToken } = require("../middleware/verifyAuth");

const dompetRoutes = (router) => {
  router.post("/dompet",verifyToken, createDompet);
  router.get("/dompet",verifyToken, getDompet);
  router.get("/dompet/user",verifyToken, getDompetByIdUser);
  router.put("/dompet",verifyToken, updateDompet);

  router.delete("/dompet/:idDompet", deleteDompet);
};

module.exports = { dompetRoutes };
