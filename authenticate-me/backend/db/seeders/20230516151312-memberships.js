'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'host'
      },
      {
        userId: 2,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 3,
        groupId: 1,
        status: 'pending'
      },
      {
        userId: 1,
        groupId: 2,
        status: 'host'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'co-host'
      },
      {
        userId: 3,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 1,
        groupId: 3,
        status: 'host'
      },
      {
        userId: 2,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 3,
        groupId: 3,
        status: 'co-host'
      }])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
