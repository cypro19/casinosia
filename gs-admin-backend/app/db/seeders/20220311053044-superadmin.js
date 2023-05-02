"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.bulkInsert("super_admin_users", [
      {
        first_name: "Superadmin",
        last_name: "One",
        email: "superadmin1@gammastack.com",
        password:
          "$2b$10$Wm03.ltZgQ0N70IMQ6ucRuU9yKQUKIt7yMkzO5Rd0qiKo4ASRhfkG",
        super_role_id: 1,
        is_active: true,
        super_admin_username: "superAdminOne",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("super_admin_user_permissions", [
      {
        super_admin_user_id: 1,
        permission: JSON.stringify({
          Themes: ["C", "R", "U", "T", "D"],
          Currencies: ["C", "R", "U"],
          Admins: ["C", "R", "U", "T", "D"],
          CMS: ["C", "R", "U", "T", "D"],
          Users: ["R", "U", "SR", "AB"],
          Transactions: ["C", "R", "U", "T", "D"],
          Bonus: ["C", "R", "U", "T", "D", "Issue"],
          KycLabel: ["C", "R", "U", "T", "D"],
          RestrictedCountry: ["C", "R", "U", "T", "D"],
          CasinoManagement: ["C", "R", "U", "T", "D"],
          RegistrationField: ["C", "R", "U", "T", "D"],
          LivePlayerReport: ["C", "R", "U", "T", "D"],
          PlayerManagementReport: ["C", "R", "U", "T", "D"],
          PlayerLiabilityReport: ["C", "R", "U", "T", "D"],
          KpiSummaryReport: ["C", "R", "U", "T", "D"],
          KpiReport: ["C", "R", "U", "T", "D"],
          GameReport: ["C", "R", "U", "T", "D"],
          LoyaltyManagement: ["R", "U"],
          EmailTemplate: ["C", "R", "U", "TE", "D"],
          ImageGallery: ["C", "R", "U", "D"],
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.bulkDelete("super_admin_users", null, {});
    await queryInterface.bulkDelete("super_admin_user_permissions", null, {});
  },
};
