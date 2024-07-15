var DataTypes = require("sequelize").DataTypes;
var _dompet = require("./dompet");
var _kategori = require("./kategori");
var _transaksi = require("./transaksi");
var _user = require("./user");

function initModels(sequelize) {
  var dompet = _dompet(sequelize, DataTypes);
  var kategori = _kategori(sequelize, DataTypes);
  var transaksi = _transaksi(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  transaksi.belongsTo(dompet, { as: "idDompet_dompet", foreignKey: "idDompet"});
  dompet.hasMany(transaksi, { as: "transaksis", foreignKey: "idDompet"});
  transaksi.belongsTo(kategori, { as: "idKategori_kategori", foreignKey: "idKategori"});
  kategori.hasMany(transaksi, { as: "transaksis", foreignKey: "idKategori"});
  dompet.belongsTo(user, { as: "idUser_user", foreignKey: "idUser"});
  user.hasMany(dompet, { as: "dompets", foreignKey: "idUser"});

  return {
    dompet,
    kategori,
    transaksi,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
