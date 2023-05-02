import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { uploadLogo, getKey } from "../../utils/common";
import {
  WAGERING_TYPE,
  KEYS,
  ROLE,
  BONUS_TYPE,
  MAX_QUANTITY,
  TIME_PERIOD,
} from "../../utils/constant";

const constraints = {
  user: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
  bonusId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: { allowEmpty: false },
  },
  promotionTitle: {
    presence: false,
  },
  validFrom: {
    presence: false,
  },
  validTo: {
    presence: false,
  },
  termCondition: {
    presence: false,
  },
  quantity: {
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
  depositBonusPercent: {
    presence: false,
  },
  wageringRequirementType: {
    inclusion: {
      within: ["bonus", "bonusdeposit"],
      message: "can be bonus or bonusdeposit",
    },
    presence: false,
  },
  wageringTemplateId: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  wageringMultiplier: {
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
  daysToClear: {
    presence: false,
  },
  description: {
    presence: false,
  },
  gameIds: {
    presence: false,
  },
  timePeriod: {
    presence: false,
    inclusion: {
      within: ["1", "7", "30", "", null],
      message: "can be daily(1), weekly(7) or monthly(30)",
    },
  },
  other: {
    presence: false,
  },
};

export class UpdateBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      user,
      userType,
      bonusId,
      promotionTitle,
      validFrom,
      validTo,
      termCondition,
      currency,
      paymentMethods,
      quantity,
      bonusImage,
      isActive,
      depositBonusPercent,
      wageringMultiplier,
      wageringTemplateId,
      other,
      isSticky,
      wageringRequirementType,
      daysToClear,
      validOnDays,
      allowAboveZero,
      visibleInPromotions,
      description,
      gameIds,
      timePeriod,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      let query = { bonusId };
      let bonusBetOnly = true;

      if (userType === ROLE.ADMIN) {
        if (user.adminRoleId !== 1) {
          query = { ...query, adminId: user?.parentId };
        } else {
          query = { ...query, adminId: user.adminUserId };
        }
      }

      const checkBonusExist = await getOne({
        model: db.Bonus,
        data: query,
      });

      if (!checkBonusExist) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Bonus ID " + ERROR_MSG.NOT_FOUND
        );
      } else if (checkBonusExist.claimedCount > 0) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Bonus is already claimed by user "
        );
      }

      let newBonusDetails = {
        promotionTitle: {
          ...checkBonusExist.promotionTitle,
          ...JSON.parse(promotionTitle),
        },
        termCondition: {
          ...checkBonusExist.termCondition,
          ...JSON.parse(termCondition),
        },
        paymentMethods,
        description: {
          ...checkBonusExist.description,
          ...JSON.parse(description),
        },
      };

      if (currency) {
        if (typeof currency === "string") currency = JSON.parse(currency);
        for (const key of Object.keys(currency)) {
          if (checkBonusExist.bonusType === BONUS_TYPE.BALANCE) {
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
              checkBonusExist.bonusType === BONUS_TYPE.DEPOSIT ||
              checkBonusExist.bonusType === BONUS_TYPE.WAGERING
            ) {
              if (!currency[key][KEYS.MIN_BALANCE])
                return this.addError(
                  ERRORS.BAD_DATA,
                  KEYS.MIN_BALANCE + " key missing for currency " + key
                );
            }
          }
        }

        const BonusCurrency = {};

        newBonusDetails = { ...newBonusDetails };
      }

      if (wageringTemplateId) {
        const wageringTemplateExist = await getOne({
          model: db.WageringTemplate,
          data: {
            wageringTemplateId,
            [Op.or]: [
              { parentType: ROLE.ADMIN },
              { parentType: ROLE.SUPERADMIN },
            ],
          },
        });

        if (!wageringTemplateExist)
          return this.addError(
            ERRORS.BAD_DATA,
            "Wagering Template " + ERROR_MSG.NOT_EXISTS
          );

        newBonusDetails = { ...newBonusDetails, wageringTemplateId };
      }

      if (wageringRequirementType) {
        wageringRequirementType =
          WAGERING_TYPE[wageringRequirementType.toUpperCase()];
        newBonusDetails = { ...newBonusDetails, wageringRequirementType };
      }

      if (isSticky) {
        if (JSON.parse(isSticky)) {
          if (checkBonusExist.bonusType === BONUS_TYPE.FREESPINS) {
            if (
              wageringRequirementType &&
              wageringRequirementType !== WAGERING_TYPE.BONUS
            ) {
              return this.addError(ERRORS.BAD_DATA, ERROR_MSG.WAGERING_TYPE);
            }
          } else if (
            checkBonusExist.bonusType !== BONUS_TYPE.BALANCE &&
            wageringRequirementType &&
            wageringRequirementType !== WAGERING_TYPE.BONUSDEPOSIT
          ) {
            return this.addError(ERRORS.BAD_DATA, ERROR_MSG.WAGERING_TYPE);
          }
          bonusBetOnly = false;
        } else if (
          wageringRequirementType &&
          wageringRequirementType !== WAGERING_TYPE.BONUS
        ) {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.WAGERING_TYPE);
        }
        newBonusDetails = { ...newBonusDetails, isSticky, bonusBetOnly };
      }

      if (timePeriod) newBonusDetails = { ...newBonusDetails, timePeriod };
      if (validFrom) newBonusDetails = { ...newBonusDetails, validFrom };
      if (validTo) newBonusDetails = { ...newBonusDetails, validTo };
      if (isActive) newBonusDetails = { ...newBonusDetails, isActive };
      if (depositBonusPercent)
        newBonusDetails = { ...newBonusDetails, depositBonusPercent };
      if (wageringMultiplier)
        newBonusDetails = { ...newBonusDetails, wageringMultiplier };
      if (allowAboveZero)
        newBonusDetails = { ...newBonusDetails, allowAboveZero };
      if (visibleInPromotions)
        newBonusDetails = { ...newBonusDetails, visibleInPromotions };
      if (validOnDays) {
        if (typeof validOnDays === "string")
          validOnDays = JSON.parse(validOnDays);
        newBonusDetails = { ...newBonusDetails, validOnDays };
      }

      if (other) {
        if (typeof other === "string") other = JSON.parse(other);
        newBonusDetails = { ...newBonusDetails, other };
      }

      if (!daysToClear)
        return this.addError(ERRORS.NOT_FOUND, "Days to clear required.");
      newBonusDetails = { ...newBonusDetails, daysToClear };

      if (checkBonusExist.bonusType === BONUS_TYPE.FREESPINS) {
        bonusBetOnly = true;
        if (!quantity) {
          return this.addError(
            ERRORS.NOT_FOUND,
            "Free Spins quantity required."
          );
        } else if (parseInt(quantity) > MAX_QUANTITY) {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.SPINS_QUANTITY);
        }

        if (parseInt(daysToClear) > TIME_PERIOD.MONTHLY)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.SPINS_VALIDITY);
        if (gameIds && !gameIds.length)
          return this.addError(ERRORS.NOT_FOUND, "Games required.");

        if (typeof gameIds === "string") gameIds = JSON.parse(gameIds);
        newBonusDetails = {
          ...newBonusDetails,
          gameIds,
          quantity,
          bonusBetOnly,
        };
      }

      if (bonusImage && typeof bonusImage === "object") {
        const fileName = `${process.env.NODE_ENV}/bonus_logo/${
          checkBonusExist.bonusId
        }-${Date.now()}.${bonusImage.mimetype.split("/")[1]}`;

        let key;

        if (checkBonusExist.imageUrl) {
          key = getKey(checkBonusExist.imageUrl);
        }

        const { Location } = await uploadLogo(bonusImage, fileName, key);
        newBonusDetails = { ...newBonusDetails, imageUrl: Location };
      }

      const updatedBonus = await updateEntity({
        model: db.Bonus,
        values: { bonusId: checkBonusExist.bonusId },
        data: { ...newBonusDetails },
        transaction: t,
      });

      await t.commit();
      return { updatedBonus, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
