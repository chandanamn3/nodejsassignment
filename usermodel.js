const { Sequelize, sequelize } = require("./database-config");

const User = sequelize
.define(
  "user",
  {
  
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false, 
        unique: true,
        validate:{
            isEmail: true,
        } 
    },
    password: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);
module.exports = User;