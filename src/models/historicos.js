module.exports = (sequelize, DataType) => {
  const Historicos = sequelize.define("Historicos", {
    historico_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataType.STRING,
      allowNull: false,
    },
    cantidad_enviados: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    cantidad_no_enviados: {
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
