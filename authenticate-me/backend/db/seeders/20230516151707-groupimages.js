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
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117597241482420244/x9vDHPKcAJ5gQAAAABJRU5ErkJggg.png',
        preview: true
      },
      {
        groupId: 2,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117597506952507402/images.png',
        preview: true
      },
      {
        groupId: 3,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117597795575140362/Z.png',
        preview: true
      },
      {
        groupId: 4,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117597944133193818/2Q.png',
        preview: true
      },
      {
        groupId: 5,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117598608078938145/9k.png',
        preview: true
      },
      {
        groupId: 6,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117598827579445278/2Q.png',
        preview: true
      },
      {
        groupId: 7,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117599019313668116/9k.png',
        preview: true
      },
      {
        groupId: 8,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117599193213714504/9k.png',
        preview: true
      },
      {
        groupId: 9,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117599320594727042/Z.png',
        preview: true
      },
      {
        groupId: 10,
        url:'https://cdn.discordapp.com/attachments/1116415077218779176/1117599452086153236/Z.png',
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
