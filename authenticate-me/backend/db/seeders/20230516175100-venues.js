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
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: 'place',
        city: 'Atlanta',
        state: 'Georgia',
        lat:26.2374,
        lng: -92.3
      },
      {
        groupId: 1,
        address: 'place3',
        city: 'Atlanta3',
        state: 'Georgia3',
        lat:26.23743,
        lng: -92.33
      },
      {
        groupId: 2,
        address: 'place2',
        city: 'Atlanta2',
        state: 'Georgia2',
        lat:26.23742,
        lng: -92.32
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['place','place2','place3'] }
    }, {});
  }
};
