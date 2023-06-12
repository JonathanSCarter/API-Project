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
        name: 'Meat Lovers Club',
        about: 'This is a group for meat enthusiasts who enjoy various types of meat dishes.',
        type: 'In person',
        private: false,
        city: 'Chicago',
        state: 'Illinois'
      },
      {
        organizerId: 2,
        name: 'Carnivore Society',
        about: 'Join this group if you have a passion for meat and want to explore different meat-based recipes.',
        type: 'In person',
        private: true,
        city: 'Houston',
        state: 'Texas'
      },
      {
        organizerId: 3,
        name: 'Online Meat Eaters',
        about: 'Connect with fellow meat lovers online and share your favorite meat-based dishes.',
        type: 'Online',
        private: false,
        city: 'Denver',
        state: 'Colorado'
      },
      {
        organizerId: 1,
        name: 'Grill Masters',
        about: 'If you enjoy grilling and barbecuing meat, this group is perfect for you.',
        type: 'In person',
        private: false,
        city: 'Atlanta',
        state: 'Georgia'
      },
      {
        organizerId: 2,
        name: 'Meat Connoisseurs',
        about: 'Join this exclusive group of meat connoisseurs to explore the finest cuts of meat and cooking techniques.',
        type: 'In person',
        private: true,
        city: 'Miami',
        state: 'Florida'
      },
      {
        organizerId: 3,
        name: 'Online BBQ Enthusiasts',
        about: 'Connect with fellow barbecue enthusiasts online and share your love for perfectly smoked meats.',
        type: 'Online',
        private: true,
        city: 'Austin',
        state: 'Texas'
      },
      {
        organizerId: 1,
        name: 'Steak Lovers',
        about: "If you're passionate about steaks and want to discover the best steak recipes, this group is for you.",
        type: 'In person',
        private: false,
        city: 'Phoenix',
        state: 'Arizona'
      },
      {
        organizerId: 2,
        name: 'Meat and Grill Aficionados',
        about: 'Join this group to meet other meat and grilling enthusiasts and exchange tips and recipes.',
        type: 'In person',
        private: true,
        city: 'Seattle',
        state: 'Washington'
      },
      {
        organizerId: 3,
        name: 'Online Meat Masters',
        about: 'Connect with seasoned meat chefs online and learn from their expertise in cooking meat to perfection.',
        type: 'Online',
        private: false,
        city: 'Boston',
        state: 'Massachusetts'
      },
      {
        organizerId: 1,
        name: 'Bacon Lovers United',
        about: "If you're crazy about bacon and want to explore creative bacon recipes, this group is for you.",
        type: 'In person',
        private: false,
        city: 'Portland',
        state: 'Oregon'
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
    }, {});
  }
};
