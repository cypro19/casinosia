import { Op } from "sequelize";
import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { LiveUpdateWalletService } from "../microservice";
import { BONUS_STATUS, ROLE } from "../../utils/constant";
import { IssueFreeSpinService } from "../casino/issueFreeSpins";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  userBonusId: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  inDeposit: {
    presence: false,
  },
  origin: {
    presence: { allowEmpty: false },
  },
};

export class ActivateBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { id, userBonusId, user, inDeposit, origin } = this.filteredArgs;
    let data = { status: BONUS_STATUS.IN_PROCESS };
    const userDetails = user;

    try {
      const activeBonus = await getOne({
        model: db.UserBonus,
        data: {
          userId: id,
          status: { [Op.in]: [BONUS_STATUS.ACTIVE, BONUS_STATUS.IN_PROCESS] },
        },
        attributes: ["userBonusId", "status"],
      });

      if (activeBonus) {
        if (
          activeBonus.status === BONUS_STATUS.IN_PROCESS &&
          activeBonus.userBonusId === userBonusId
        ) {
          return { success: true, message: SUCCESS_MSG.AVAIL_BONUS };
        }
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.ACTIVE_BONUS);
      }

      const userBonusExists = await getOne({
        model: db.UserBonus,
        data: { userId: id, userBonusId },
        include: {
          model: db.Bonus,
          as: "bonus",
          attributes: [
            "bonusId",
            "currency",
            "depositBonusPercent",
            "promotionTitle",
            "appliedBonusId",
            "timePeriod",
            "wageringRequirementType",
          ],
        },
      });

      if (!userBonusExists) {
        return this.addError(ERRORS.BAD_DATA, "Bonus " + ERROR_MSG.NOT_EXISTS);
      } else if (
        userBonusExists.status !== BONUS_STATUS.PENDING &&
        userBonusExists.status !== BONUS_STATUS.CLAIMING
      ) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_AVAIL);
      } else if (userBonusExists.claimedAt > new Date(Date.now())) {
        return this.addError(
          ERRORS.BAD_DATA,
          ERROR_MSG.BONUS_VALIDITY +
            userBonusExists.claimedAt.toISOString().substring(0, 10)
        );
      }

      if (userBonusExists.status === BONUS_STATUS.PENDING) {
        if (!inDeposit) data = { status: BONUS_STATUS.CLAIMING };

        await db.UserBonus.update(
          { status: BONUS_STATUS.PENDING },
          {
            where: {
              userId: id,
              status: BONUS_STATUS.CLAIMING,
              issuerRole: { [Op.in]: [ROLE.SUPERADMIN, ROLE.ADMIN] },
            },
          }
        );
      }

      if (userBonusExists.freeSpinsQty) {
        user.dataValues.issueId = userBonusExists.uniqueId;

        let request = {
          user: user,
          games: Object.keys(userBonusExists.games),
          freeSpinsQuantity: userBonusExists.freeSpinsQty,
          validUntilDays: userBonusExists.expireAt,
        };

        if (userBonusExists.betLevel)
          request = { ...request, betLevel: userBonusExists.betLevel };

        const spinsIssue = await IssueFreeSpinService.execute(request);

        if (!spinsIssue.result.success) {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_AVAIL);
        }

        data = { status: BONUS_STATUS.ACTIVE };
      }

      await userBonusExists.set({ ...data }).save();

      userBonusExists.domainName = origin;

      await LiveUpdateWalletService.execute({
        userUuid: user.uniqueId,
        cash: userDetails.userWallet.amount,
        nonCash: userDetails.userWallet.nonCashAmount,
        userId: id,
        origin: "user-end",
      });

      return { success: true, message: SUCCESS_MSG.AVAIL_BONUS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
