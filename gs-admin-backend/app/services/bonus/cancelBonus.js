import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { bonusObject, createConnection } from "../helper/rabbitMq";
import {
  BONUS_STATUS,
  ROLE,
  ROLE_ID,
  WAGER_STATUS,
} from "../../utils/constant";

const constraints = {
  userId: {
    presence: { allowEmpty: false },
  },
  userBonusId: {
    presence: { allowEmpty: false },
  },
  user: {
    presence: { allowEmpty: false },
  },
  userType: {
    presence: { allowEmpty: false },
  },
};

export class CancelBonusService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { userId, userBonusId, user, userType } = this.filteredArgs;
    const cancelledBy = user?.superAdminUsername
      ? user.superAdminUsername
      : user.agentName;

    try {
      const userDetails = await getOne({
        model: db.User,
        data: { userId },
        attributes: [],
      });

      const userBonusExists = await getOne({
        model: db.UserBonus,
        data: { userId, userBonusId },
        include: {
          model: db.Bonus,
          as: "bonus",
          attributes: ["bonusId", "claimedCount", "isSticky", "promotionTitle"],
        },
      });

      if (!userBonusExists)
        return this.addError(ERRORS.BAD_DATA, "Bonus " + ERROR_MSG.NOT_EXISTS);

      if (
        (userType === ROLE.SUPERADMIN &&
          user.superRoleId !== ROLE_ID.SUPERADMIN &&
          userBonusExists.issuerId !== user.superAdminUserId) ||
        (userType === ROLE.ADMIN &&
          user.adminRoleId !== ROLE_ID.SUPERADMIN &&
          userBonusExists.issuerId !== user.adminUserId)
      ) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_DELETE);
      }

      if (userBonusExists.status === BONUS_STATUS.ACTIVE) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.BONUS_PENDING);
      }

      await userBonusExists
        .set({
          status: BONUS_STATUS.CANCELLED,
          wageringStatus: WAGER_STATUS.CANCELLED,
          cancelledBy,
        })
        .save();

      userBonusExists.domainName = userDetails?.domain;
      const details = await bonusObject(userBonusExists);
      await createConnection("PostBonuses", details);

      await userBonusExists.bonus
        .set({ claimedCount: userBonusExists.bonus.claimedCount - 1 })
        .save();

      return { success: true, message: SUCCESS_MSG.CANCEL_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
