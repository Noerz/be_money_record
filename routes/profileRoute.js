const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
} = require("../controller/profileController");
const { verifyToken } = require("../middleware/verifyAuth");

const profileRoutes = (router) => {
  router.get("/profile", verifyToken, getProfile);
  //   router.get("/dompet",verifyToken, getDompet);
  //   router.get("/dompet/user",verifyToken, getDompetByIdUser);
  router.put("/profile", verifyToken, updateProfile);
  //   router.delete("/dompet/:idDompet", deleteDompet);
};

module.exports = { profileRoutes };
