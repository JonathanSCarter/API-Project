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
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: null,
        groupId: 1,
        name: 'Event 1',
        description: 'Description 1',
        type: 'Online',
        capacity: 100,
        price: 9.99,
        startDate: new Date('2024-05-20T10:00:00Z'),
        endDate: new Date('2024-05-20T12:00:00Z'),
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Event 2',
        description: 'Description 2',
        type: 'In person',
        capacity: 50,
        price: 19.99,
        startDate: new Date('2024-05-22T14:00:00Z'),
        endDate: new Date('2024-05-22T16:00:00Z'),
      },
  ])},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['Online','In person'] }
    }, {});
  }
};
