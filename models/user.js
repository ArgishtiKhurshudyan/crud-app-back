'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      const {User, Product} = models;
      User.hasMany(Product, {foreignKey: 'user_id'})
    }
  }

  User.init({
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      required: true,
    },
    firstName: DataTypes.STRING,
    role:DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    confirmPassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};