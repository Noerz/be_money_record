const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaksi', {
    idTransaksi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    namaTransaksi: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis: {
      type: DataTypes.ENUM('pemasukan','pengeluaran'),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dompet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dompet',
        key: 'idDompet'
      }
    },
    idKategori: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kategori',
        key: 'idKategori'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'transaksi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idTransaksi" },
        ]
      },
      {
        name: "idDompet",
        using: "BTREE",
        fields: [
          { name: "dompet_id" },
        ]
      },
      {
        name: "idKategori",
        using: "BTREE",
        fields: [
          { name: "idKategori" },
        ]
      },
      {
        name: "dompet_id",
        using: "BTREE",
        fields: [
          { name: "dompet_id" },
        ]
      },
    ]
  });
};
