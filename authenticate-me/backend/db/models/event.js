'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, { foreignKey: 'groupId' })
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' })
      Event.hasMany(models.EventImage, {foreignKey: 'eventId'})

    }
  }
  Event.init({
    id: {
      // allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: {
      type: DataTypes.INTEGER,
    },
    groupId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        isLong(value) {
          if (value.length < 5) throw new Error()
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      // allowNull: false,
      // validate: {
      //   NoVenue(value) {
      //     if ((value && this.venueId !== null) || (!value && this.venueId)) throw new Error()
      //   }
      // }
    },
    capacity: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(99, 2),
      // allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      // allowNull: false,
      // validate: {
      //   isDate: true,
      // }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   isAfterStartDate(value) {
      //     if (value <= this.startDate) throw new Error('End date must be after the start date');
      //   },
      //   isDate: true,

      // },
    },
  }, {
    sequelize,
    modelName: 'Event',
    primaryKey: 'id'
  });
  return Event;
};
