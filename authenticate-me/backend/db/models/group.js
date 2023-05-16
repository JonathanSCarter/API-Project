'use strict';
const { error } = require('console');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {foreignKey: 'organizerId'})
      Group.hasMany(models.Membership, {foreignKey: 'groupId'})
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId'})
      Group.hasMany(models.Venue, {foreignKey: 'groupId'})
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLong(value){
          if(value.length < 50) throw new Error()
        }
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false
    },
    private: DataTypes.BOOLEAN,
    city: {
      type:DataTypes.STRING,
      allowNull: false
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
