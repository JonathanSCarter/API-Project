'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
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
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Online Group 1',
        about: 'This is an online group for people interested in hiking.',
        type: 'Online',
        private: false,
        city: 'Los Angeles',
        state: 'California',
      },
      {
        organizerId: 2,
        name: 'In Person Group 1',
        about: 'This is an in-person group for people interested in cooking.',
        type: 'In person',
        private: true,
        city: 'San Francisco',
        state: 'California'
      },
      {
        organizerId: 3,
        name: 'Online Group 2',
        about: 'This is an online group for people interested in yoga.',
        type: 'Online',
        private: true,
        city: 'New York',
        state: 'New York',
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Online Group 1', 'In Person Group 1', 'Online Group 2'] }
    }, {});
  }
};
