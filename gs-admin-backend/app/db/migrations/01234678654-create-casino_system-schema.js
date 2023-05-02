"use strict";

// To create casino_system
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createSchema("casino_system");
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropSchema("casino_system");
  },
};
