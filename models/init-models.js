var DataTypes = require("sequelize").DataTypes;
var _auth = require("./auth");
var _dompet = require("./dompet");
var _kategori = require("./kategori");
var _transaksi = require("./transaksi");
var _user = require("./user");

function initModels(sequelize) {
  var auth = _auth(sequelize, DataTypes);
  var dompet = _dompet(sequelize, DataTypes);
  var kategori = _kategori(sequelize, DataTypes);
  var transaksi = _transaksi(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  user.belongsTo(auth, { as: "auth", foreignKey: "auth_id"});
  auth.hasMany(user, { as: "users", foreignKey: "auth_id"});
  transaksi.belongsTo(dompet, { as: "dompet", foreignKey: "dompet_id"});
  dompet.hasMany(transaksi, { as: "transaksis", foreignKey: "dompet_id"});
  transaksi.belongsTo(kategori, { as: "idKategori_kategori", foreignKey: "idKategori"});
  kategori.hasMany(transaksi, { as: "transaksis", foreignKey: "idKategori"});
  dompet.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(dompet, { as: "dompets", foreignKey: "user_id"});

  return {
    auth,
    dompet,
    kategori,
    transaksi,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
