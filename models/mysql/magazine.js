module.exports = (sequelize, DataTypes) => {
  const Magazine = sequelize.define(
    "magazine",
    {
      MagazineID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      number: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );

  // Magazine.associate = (models) => {
  //   Magazine.belongsTo(models.publisher, {
  //     foreignKey: "PublisherID",
  //   });
  // };

  return Magazine;
};
