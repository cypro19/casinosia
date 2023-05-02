import { Op } from "sequelize";
import db from "../../db/models";
import { uploadLogo } from "../../utils/common";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne, updateEntity } from "../helper/crud";
import {
  BONUS_TYPE,
  ROLE,
  WAGERING_TYPE,
  KEYS,
  MAX_QUANTITY,
  TIME_PERIOD,
} from "../../utils/constant";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  promotionTitle: {
    presence: false,
  },
  bonusType: {
    inclusion: {
      within: ["joining", "freespins", "deposit"],
      message: "can be match, Joining, freespins, deposit",
    },
    presence: { allowEmpty: false },
  },
  validFrom: {
    presence: false,
  },
  validTo: {
    presence: false,
  },
  daysToClear: {
    presence: false,
  },
  termCondition: {
    presence: false,
  },
  quantity: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  currency: {
    presence: false,
  },
  paymentMethods: {
    presence: false,
  },
  bonusImage: {
    presence: false,
  },
  isActive: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  // for balance bonus it is minimum bonus percent
  depositBonusPercent: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  wageringRequirementType: {
    inclusion: {
      within: ["bonus", "bonusdeposit"],
      message: "can be bonus or bonusdeposit",
    },
    presence: false,
  },
  wageringMultiplier: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  validOnDays: {
    presence: false,
  },
  allowAboveZero: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  visibleInPromotions: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  isSticky: {
    inclusion: {
      within: ["true", "false", "", null],
      message: "can be true or false",
    },
    presence: false,
  },
  appliedBonusId: {
    presence: false,
  },
  description: {
    presence: { allowEmpty: false },
  },
  gameIds: {
    presence: false,
  },
  timePeriod: {
    inclusion: {
      within: ["1", "7", "30", "", null],
      message: "can be daily(1), weekly(7) or monthly(30)",
    },
    presence: false,
  },
  other: {
    presence: false,
  },
  user: {
    presence: false,
  },
};

export class CreateBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      id,
      userType,
      promotionTitle,
      bonusType,
      validFrom,
      validTo,
      daysToClear,
      termCondition,
      currency,
      paymentMethods,
      quantity,
      bonusImage,
      isActive,
      depositBonusPercent,
      wageringRequirementType,
      wageringMultiplier,
      validOnDays,
      allowAboveZero,
      visibleInPromotions,
      isSticky,
      appliedBonusId,
      description,
      gameIds,
      timePeriod,
      user,
      other,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      let IsExisting;
      if (bonusType === "joining") {
        IsExisting = await db.Bonus.findOne({
          raw: true,
          where: { bonusType: "joining" },
        });
      }
      if (IsExisting) return this.addError(ERRORS.FORBIDDEN, ERROR_MSG.EXISTS);

      bonusType = bonusType.toUpperCase();
      const parentType = userType;
      const parentId = id;
      let wageringTemplateExist;
      let currencyCode = "EUR";
      if (currency) {
        if (typeof currency === "string") currency = JSON.parse(currency);
        for (const key of Object.keys(currency)) {
          currencyCode = key;
          if (BONUS_TYPE[bonusType] === BONUS_TYPE.BALANCE) {
            break;
          } else {
            if (!currency[key][KEYS.MAX_BONUS_THRESHOLD])
              return this.addError(
                ERRORS.BAD_DATA,
                KEYS.MAX_BONUS_THRESHOLD + " key missing for currency " + key
              );
            if (!currency[key][KEYS.ZERO_OUT_THRESHOLD])
              return this.addError(
                ERRORS.BAD_DATA,
                KEYS.ZERO_OUT_THRESHOLD + " key missing for currency " + key
              );
            if (!currency[key][KEYS.MAX_WIN_AMOUNT])
              return this.addError(
                ERRORS.BAD_DATA,
                KEYS.MAX_WIN_AMOUNT + " key missing for currency " + key
              );
            if (!currency[key][KEYS.MIN_DEPOSIT])
              return this.addError(
                ERRORS.BAD_DATA,
                KEYS.MAX_WIN_AMOUNT + " key missing for currency " + key
              );
            if (
              BONUS_TYPE[bonusType] === BONUS_TYPE.DEPOSIT ||
              BONUS_TYPE[bonusType] === BONUS_TYPE.WAGERING
            ) {
              if (!currency[key][KEYS.MIN_BALANCE])
                return this.addError(
                  ERRORS.BAD_DATA,
                  KEYS.MIN_BALANCE + " key missing for currency " + key
                );
            }
          }
        }
      }
      var wageringTemplateId = 1;
      let newBonus = {
        promotionTitle: JSON.parse(promotionTitle),
        parentType,
        parentId,
        bonusType: BONUS_TYPE[bonusType],
        wageringTemplateId: wageringTemplateId,
        termCondition: JSON.parse(termCondition),
        description: JSON.parse(description),
      };

      if (wageringRequirementType) {
        wageringRequirementType =
          WAGERING_TYPE[wageringRequirementType.toUpperCase()];
        newBonus = { ...newBonus, wageringRequirementType };
      }
      if (validFrom) newBonus = { ...newBonus, validFrom };
      if (validTo) newBonus = { ...newBonus, validTo };
      if (isActive) newBonus = { ...newBonus, isActive };
      if (depositBonusPercent) newBonus = { ...newBonus, depositBonusPercent };
      if (allowAboveZero) newBonus = { ...newBonus, allowAboveZero };
      if (visibleInPromotions) newBonus = { ...newBonus, visibleInPromotions };
      if (isSticky) newBonus = { ...newBonus, isSticky };
      if (paymentMethods) newBonus = { ...newBonus, paymentMethods };
      if (wageringMultiplier) newBonus = { ...newBonus, wageringMultiplier };

      if (!daysToClear)
        return this.addError(ERRORS.NOT_FOUND, "Days to clear required.");
      newBonus = { ...newBonus, daysToClear };

      if (appliedBonusId) {
        const checkBonusExist = await getOne({
          model: db.Bonus,
          data: { bonusId: appliedBonusId },
        });

        if (!checkBonusExist) {
          return this.addError(
            ERRORS.BAD_DATA,
            "Applied Bonus ID " + ERROR_MSG.NOT_EXISTS
          );
        }
        newBonus = { ...newBonus, appliedBonusId };
      }

      if (validOnDays) {
        if (typeof validOnDays === "string")
          validOnDays = JSON.parse(validOnDays);
        newBonus = { ...newBonus, validOnDays };
      }

      if (other) {
        if (typeof other === "string") other = JSON.parse(other);
        newBonus = { ...newBonus, other };
      }

      if (BONUS_TYPE[bonusType] === BONUS_TYPE.FREESPINS) {
        if (!quantity) {
          return this.addError(
            ERRORS.NOT_FOUND,
            "Free Spins quantity required."
          );
        } else if (parseInt(quantity) > MAX_QUANTITY) {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.SPINS_QUANTITY);
        }

        if (!gameIds || (gameIds && !gameIds.length))
          return this.addError(ERRORS.NOT_FOUND, "Games required.");
        if (typeof gameIds === "string") gameIds = JSON.parse(gameIds);
        if (parseInt(daysToClear) > TIME_PERIOD.MONTHLY)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.SPINS_VALIDITY);

        newBonus = { ...newBonus, gameIds, bonusBetOnly: true, quantity };

        if (
          JSON.parse(isSticky) &&
          wageringRequirementType &&
          wageringRequirementType !== WAGERING_TYPE.BONUS
        ) {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.WAGERING_TYPE);
        }
        newBonus = { ...newBonus };
      }
      const bonuses = [];
      if (bonusImage && typeof bonusImage === "object") {
        const fileName = `${process.env.NODE_ENV}/bonus_logo/-${Date.now()}.${
          bonusImage.mimetype.split("/")[1]
        }`;

        let key;

        const { Location } = await uploadLogo(bonusImage, fileName, key);
        newBonus = { ...newBonus, imageUrl: Location };
      }

      const createBonus = await createNewEntity({
        model: db.Bonus,
        data: { ...newBonus, currency: currency },
        transaction: t,
      });
      bonuses.push(createBonus);
      await t.commit();

      return { bonuses, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
