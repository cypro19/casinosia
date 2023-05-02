"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.bulkInsert(
      { tableName: "multi_language_support", schema: "public" },
      [
        {
          multi_language_support_id: 1,
          language: "EN",
          casino_banner_desc: "Get an amazing 100% welcome bonus upto $100",
          casino_banner_join_now: "Join Now",
          casino_banner_tnc: "Terms and conditions apply",
          casino_favorite: "Favorite",
          casino_no_fav_games_found: "No favorite games found",
          casino_no_games_found: "No games found",
          casino_game_view_all_btn: "View All",
          casino_search: "search games",
          casino_more_games: "More Games",
          casino_providers: "Provider",
          casino_about: "About",
          casino_casino: "Casino",
          casino_faq: "FAQ",
          footer_about_site: `This website is operated by Gammix Limited, a company incorporated under the laws of Malta with registration number
          C68405 and registered address at 77, Spinola Road, St Julian, STJ 3017, Malta, contact no. +35627002270.
          Gammix Limited is licensed and regulated in virtue of a Type 1 Gaming Services licence numbered MGA/B2C/295/2015
          issued on 14th June 2016 by the Malta Gaming Authority. CrazePlay © Copyright 2019<br>
          Gambling can be addictive, please Play Responsibly. For help visit our Responsible Gambling page. Underage gambling
          is an offense. 18+`,
          footer_rights_reserved: "2022 Gammastack. All Rights Reserved",
          prom_banner_desc:
            "Welcome Promotion <br> 100% Welcome bonus Up to $200 + 50 freespins",
          prom_claim_now: "Claim Now",
          prom_read_more: "Read More",
          home_banner_desc: "Get an amazing 100% welcome bonus upto $100",
          home_banner_join_now: "Join Now",
          home_banner_tnc: "Terms and conditions apply",
          home_real_player_sec: "Real player, Real wins everyday",
          home_current_winners: "Current Winners",
          home_top_winners: "Top 5 Winners",
          home_top_games: "Top Games",
          home_testimonial: "What are players say",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
    );
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.bulkDelete(
      { tableName: "multi_language_support", schema: "public" },
      null,
      {}
    );
  },
};
