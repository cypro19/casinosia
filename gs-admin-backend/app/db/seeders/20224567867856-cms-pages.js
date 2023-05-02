module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("cms_pages", [
      {
        title: JSON.stringify({ EN: "Terms and Conditions" }),
        slug: "general-terms",
        content: JSON.stringify({
          EN: "Please ensure that you read the following legally binding agreement between TH Gambling N.V., under the brand name, oleg-gaming.com, and yourself. It is your sole responsibility to ensure that you fully understand the contents of this agreement.Upon signup you will be prompted with the option to accept that you agree with these Terms & Conditions. By selecting this, you acknowledge that you have read and agreed to be bound by the Terms & Conditions of this agreement and the Privacy Policy set out here .These Terms & Conditions apply to all customers who use any of the products, applications or websites offered by arcanebet, or register an account with us. If you have any questions about these Terms & Conditions, you should contact our Customer Support Team before proceeding. If you do not agree to any of these Terms & Conditions, you should not make use of our services",
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: JSON.stringify({ EN: "Privacy Policy" }),
        slug: "information-collected",
        content: JSON.stringify({
          EN: "The information and data about you which we may collect, use and process includes but is not limited to the following: IP address, operating system, browser type and settings, device type and system activity. This information is useful for us as it allows us to see how you interact with our services and helps us provide a better experience",
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: JSON.stringify({ EN: "Cookie Policy" }),
        slug: "this-the-cookie-policy",
        content: JSON.stringify({
          EN: "What exactly are cookies? Simply put a cookie is a tiny file that is downloaded to your computer or stored on your web browser (Chrome, Firefox, Safari etc.). They allow your web-browser to remember specific information about a website or webpage As is common practice with almost all professional websites, this website uses cookies and pixels to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored, however this may downgrade or break certain elements of the websites functionality",
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cms_pages", null, {});
  },
};
