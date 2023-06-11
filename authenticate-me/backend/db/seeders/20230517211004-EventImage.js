'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 2,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 3,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 4,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 5,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 6,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 7,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 8,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 9,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 10,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 11,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 12,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 13,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 14,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 15,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 16,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 17,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 18,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 19,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 20,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 21,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 22,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 23,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 24,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 25,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 26,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 27,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },      {
        eventId: 28,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      },
      {
        eventId: 29,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: false
      },
      {
        eventId: 30,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1116415196114722847/Z.png',
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['url','url2','url3'] }
    }, {});
  }
};
