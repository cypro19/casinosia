import db from "../../db/models";
import { getOne } from "../helper/crud";
import { ROLE } from "../../utils/constant";
import { ERROR_MSG } from "../../utils/errors";

const backTrackParent = async ({
  id,
  userType,
  toOwnerId,
  toOwnerType,
  currencyCode,
  hierarchy = [],
}) => {
  if (toOwnerType === null || toOwnerId === null) {
    return { status: false, hierarchy: null };
  } else if (toOwnerType === ROLE.USER) {
    const user = await getOne({
      model: db.User,
      data: { userId: toOwnerId },
    });

    const parent = await getOne({
      model: db.AdminUser,
      data: { adminUserId: user.parentId },
    });

    parent.dataValues.wallet = (
      await getOne({
        model: db.Wallet,
        data: { currencyCode, ownerId: user.parentId, ownerType: ROLE.ADMIN },
      })
    ).dataValues;

    parent.dataValues.userType = ROLE.ADMIN;
    parent.dataValues.id = user.parentId;
    hierarchy.push(parent.dataValues);

    if (parent.parentId === id && parent.parentType === userType) {
      return { status: true, hierarchy };
    }
    if (toOwnerType === null || toOwnerId === null) {
      return { status: false, hierarchy: null };
    }

    return backTrackParent({
      id,
      userType,
      toOwnerId: parent.adminUserId,
      toOwnerType: ROLE.ADMIN,
      currencyCode,
      hierarchy,
    });
  } else if (toOwnerType === ROLE.ADMIN) {
    const admin = await getOne({
      model: db.AdminUser,
      data: { adminUserId: toOwnerId },
      attributes: [
        "email",
        "adminUserId",
        "firstName",
        "lastName",
        "parentId",
        "parentType",
      ],
    });

    if (admin.parentType === ROLE.ADMIN) {
      const parent = await getOne({
        model: db.AdminUser,
        data: { adminUserId: admin.parentId },
        attributes: [
          "email",
          "adminUserId",
          "firstName",
          "lastName",
          "parentId",
          "parentType",
        ],
      });

      if (parent.adminUserId === id) {
        return { status: true, hierarchy };
      }

      parent.dataValues.wallet = (
        await getOne({
          model: db.Wallet,
          data: {
            currencyCode,
            ownerId: admin.parentId,
            ownerType: ROLE.ADMIN,
          },
          attributes: ["walletId", "amount", "currencyCode", "nonCashAmount"],
        })
      ).dataValues;

      parent.dataValues.userType = ROLE.ADMIN;
      parent.dataValues.id = admin.parentId;
      hierarchy.push(parent.dataValues);

      if (parent.parentId === id) {
        return { status: true, hierarchy };
      }
      return backTrackParent({
        id,
        userType,
        toOwnerId: parent.adminUserId,
        toOwnerType: ROLE.ADMIN,
        currencyCode,
        hierarchy,
      });
    } else {
      return { status: false, hierarchy: null };
    }
  } else if (toOwnerType === ROLE.SUPERADMIN) {
    const superAdmin = await getOne({
      model: db.SuperAdminUser,
      data: { superAdminUserId: toOwnerId },
      attributes: [
        "email",
        "superAdminUserId",
        "firstName",
        "lastName",
        "parentId",
        "parentType",
      ],
    });

    if (superAdmin.parentType === ROLE.SUPERADMIN) {
      const parent = await getOne({
        model: db.SuperAdminUser,
        data: { superAdminUserId: superAdmin.parentId },
        attributes: [
          "email",
          "superAdminUserId",
          "firstName",
          "lastName",
          "parentId",
          "parentType",
        ],
      });

      if (parent.superAdminUserId === id) {
        return { status: true, hierarchy };
      }

      parent.dataValues.wallet = (
        await getOne({
          model: db.Wallet,
          data: {
            currencyCode,
            ownerId: superAdmin.parentId,
            ownerType: ROLE.SUPERADMIN,
          },
          attributes: ["walletId", "amount", "currencyCode", "nonCashAmount"],
        })
      ).dataValues;

      parent.dataValues.userType = ROLE.SUPERADMIN;
      parent.dataValues.id = superAdmin.parentId;
      hierarchy.push(parent.dataValues);

      if (parent.parentId === id) {
        return { status: true, hierarchy };
      }

      return backTrackParent({
        id,
        userType,
        toOwnerId: parent.superAdminUserId,
        toOwnerType: ROLE.SUPERADMIN,
        currencyCode,
        hierarchy,
      });
    }
  }
};

const addTargetSender = ({ status, hierarchy, ownerUser }) => {
  if (status) {
    hierarchy.push(ownerUser);
    hierarchy.reverse();

    return { err: null, hierarchy };
  }
  return { err: ERROR_MSG.TRANSACTION_DENIED };
};

export const validateTransaction = async ({
  fromOwnerType,
  toOwnerType,
  toOwnerId,
  id,
  ownerUser,
  currencyCode,
  targetWallet,
}) => {
  if (toOwnerId === id && toOwnerType === fromOwnerType) {
    return { err: ERROR_MSG.NOT_ALLOWED };
  }

  if (fromOwnerType === ROLE.SUPERADMIN && toOwnerType === ROLE.SUPERADMIN) {
    if (toOwnerId < id) {
      return { err: ERROR_MSG.NOT_ALLOWED };
    }

    const superAdmin = await getOne({
      model: db.SuperAdminUser,
      data: { superAdminUserId: toOwnerId },
      attributes: [
        "email",
        "superAdminUserId",
        "firstName",
        "lastName",
        "parentId",
        "parentType",
      ],
    });

    if (!superAdmin)
      return { err: "Receiver super admin " + ERROR_MSG.NOT_EXISTS };

    superAdmin.dataValues.wallet = targetWallet;
    superAdmin.dataValues.userType = ROLE.SUPERADMIN;
    superAdmin.dataValues.id = toOwnerId;

    const { status, hierarchy } = await backTrackParent({
      id,
      userType: fromOwnerType,
      toOwnerId,
      toOwnerType,
      currencyCode,
      hierarchy: [superAdmin.dataValues],
    });

    return addTargetSender({ status, hierarchy, ownerUser });
  } else if (fromOwnerType === ROLE.ADMIN && toOwnerType === ROLE.ADMIN) {
    if (toOwnerId < id) {
      return { err: ERROR_MSG.NOT_ALLOWED };
    }

    const toAdmin = await getOne({
      model: db.AdminUser,
      data: { adminUserId: toOwnerId },
      attributes: [
        "email",
        "adminUserId",
        "firstName",
        "lastName",
        "parentId",
        "parentType",
      ],
    });

    if (!toAdmin) return { err: "Receiver Admin " + ERROR_MSG.NOT_EXISTS };

    toAdmin.dataValues.wallet = targetWallet;
    toAdmin.dataValues.userType = ROLE.ADMIN;
    toAdmin.dataValues.id = toOwnerId;

    const { status, hierarchy } = await backTrackParent({
      id,
      userType: fromOwnerType,
      toOwnerId,
      toOwnerType,
      currencyCode,
      hierarchy: [toAdmin.dataValues],
    });

    return addTargetSender({ status, hierarchy, ownerUser });
  } else {
    return { err: ERROR_MSG.NOT_ALLOWED };
  }
};
