import getSymbolFromCurrency from "currency-symbol-map";
import { REPORTING_CURRENCY } from "../../utils/constant";

export const createDemographCsv = (demographic) => {
  const returnData = [];

  demographic.forEach((country) => {
    returnData.push({
      country_name: country.countryName,
      country_code: country.country_code,
      sign_up_count: country.signUpCount,
      deposit_count: country.depositCount,
      deposit_amount:
        `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + country.depositAmount,
      conversion_rate: country.conversionRate + " %",
    });
  });

  return { fields: Object.keys(returnData[0]), data: returnData };
};

export const createPlayerLiabilityCsv = (playerLiability) => {
  const returnData = [];

  playerLiability.forEach((portal) => {
    returnData.push({
      currency_code: portal.currencyCode,
      liability:
        `${getSymbolFromCurrency(portal.currencyCode)} ` + portal.liability,
    });
  });

  return { fields: Object.keys(returnData[0]), data: returnData };
};

export const createKpiSummaryCsv = (KpiSummary) => {
  const returnData = [];

  KpiSummary.forEach((data) => {
    if (data.type === "amount") {
      returnData.push({
        data: data.rowName,
        today: `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + data.today,
        yesterday:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + data.yesterday,
        month_to_date:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + data.monthToDate,
        previous_month_to_date:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          data.prevMonthToDate,
        custom_date:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + data.customDate,
      });
    } else {
      returnData.push({
        data: data.rowName,
        today: data.today,
        yesterday: data.yesterday,
        month_to_date: data.monthToDate,
        previous_month_to_date: data.prevMonthToDate,
        custom_date: data.customDate,
      });
    }
  });

  return { fields: Object.keys(returnData[0]), data: returnData };
};

export const createKpiReportCsv = (kpiReport, type) => {
  const returnData = [];

  if (type === "provider") {
    Object.keys(kpiReport).forEach((provider) => {
      returnData.push({
        provider,
        GGR:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].GGR,
        real_bet:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].realBet,
        real_win:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].realWin,
        bonus_bet:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].bonusBet,
        bonus_win:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].bonusWin,
        bonus_GGR:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].bonusGGR,
        total_bets:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].totalBets,
      });
    });
  } else if (type === "game") {
    Object.keys(kpiReport).forEach((provider) => {
      returnData.push({
        game_identifier: provider,
        GGR:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].GGR,
        real_bet:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].realBet,
        real_win:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].realWin,
        bonus_bet:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].bonusBet,
        bonus_win:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].bonusWin,
        bonus_GGR:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].bonusGGR,
        total_bets:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` +
          kpiReport[provider].totalBets,
      });
    });
  }

  return { fields: Object.keys(returnData[0]), data: returnData };
};

export const createGameReportCsv = (gameReport, tab, userId) => {
  const returnData = [];

  if (tab === "provider") {
    gameReport.forEach((provider) => {
      returnData.push({
        id: provider.id,
        provider_name: provider.name,
        number_of_rounds: provider.roundCount,
        number_of_players: provider.playerCount,
        total_bets:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + provider.totalBet,
        total_wins:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + provider.totalWin,
        game_revenue:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + provider.GGR,
        payout: provider.payout,
      });
    });
  } else if (tab === "game") {
    gameReport.forEach((provider) => {
      returnData.push({
        id: provider.id,
        game_identifier: provider.identifier,
        game_name: provider.name,
        number_of_rounds: provider.roundCount,
        number_of_players: provider.playerCount,
        total_bets:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + provider.totalBet,
        total_wins:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + provider.totalWin,
        game_revenue:
          `${getSymbolFromCurrency(REPORTING_CURRENCY)} ` + provider.GGR,
        payout: provider.payout,
      });
    });
  }

  if (userId) {
    for (let index = 0; index < returnData.length; index++) {
      delete returnData[index].number_of_players;
    }
  }

  return { fields: Object.keys(returnData[0]), data: returnData };
};

export const createLanguageSupportKeysCsv = (supportKeys) => {
  const returnData = [];
  const fields = ["Language_Support_Keys"];

  supportKeys.forEach((supportKey) => {
    fields.push(supportKey.language);
  });

  Object.keys(supportKeys[0]).forEach((key) => {
    if (key !== "language") {
      const data = { Language_Support_Keys: key };
      supportKeys.forEach((subSupportKey) => {
        data[subSupportKey.language] = subSupportKey[key];
      });
      returnData.push(data);
    }
  });

  const returnArray = [];

  returnData.forEach((data) => {
    returnArray.push(Object.values(data));
  });

  return { fields, data: returnArray };
};
