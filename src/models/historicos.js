module.exports = (sequelize, DataType) => {
  const Historicos = sequelize.define("Historicos", {
    historico_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    anho: {
      type: DataType.NUMERIC,
      allowNull: false,
    },
    mes: {
      type: DataType.NUMERIC,
      allowNull: false,
    },
    dia: {
      type: DataType.NUMERIC,
      allowNull: false,
    },
    cant_enviados: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    cant_no_enviados: {
      type: DataType.BIGINT,
      allowNull: false,
    },
  });

  Historicos.associate = (models) => {
    Historicos.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1,
      },
    });
  };

  return Historicos;
};
