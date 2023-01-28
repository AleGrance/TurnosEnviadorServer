module.exports = (sequelize, DataType) => {

    const Turnos = sequelize.define('Turnos', {
        id_turno: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_turno: {
            type: DataType.DATEONLY,
            allowNull: false
        },
        hora_turno: {
            type: DataType.TIME,
            allowNull: false
        },
        comentario: {
            type: DataType.STRING,
            allowNull: true
        },
        profesional: {
            type: DataType.STRING,
            allowNull: false
        },
        sucursal: {
            type: DataType.STRING,
            allowNull: false
        },
        dir_sucursal: {
            type: DataType.STRING,
            allowNull: true
        },
        tel_sucursal: {
            type: DataType.STRING,
            allowNull: true
        },
        cliente: {
            type: DataType.STRING,
            allowNull: false
        },
        contacto_cliente: {
            type: DataType.STRING,
            allowNull: false
        },
        plan_cliente: {
            type: DataType.STRING,
            allowNull: true
        },
        nro_cert_cliente: {
            type: DataType.STRING,
            allowNull: true
        },
        usuario: {
            type: DataType.STRING,
            allowNull: true
        },
        estado_envio: {
            type: DataType.INTEGER,
            allowNull: false
        }
    });

    Turnos.associate = (models) => {
        Turnos.belongsTo(models.Users, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
              }
        });
    };
    return Turnos;
};