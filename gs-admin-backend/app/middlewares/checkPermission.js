import db from "../db/models";
import { ERROR_MSG } from "../utils/errors";
import { getOne } from "../services/helper/crud";
import {
  PERMISSION_TYPE,
  REQUEST_TYPE,
  ROLE,
  CASINO_TOGGLE_CASE,
  RESPONSIBLE_GAMING_ENDPOINTS,
  TEST_EMAIL,
  BONUS_ACTIONS,
  MANAGE_MONEY,
} from "../utils/constant";

export const checkPermission = async (req, res, next) => {
  try {
    const url = req.originalUrl.split("?").slice(0, 1).toString();
    let endPoint = url.split("/").slice(-1).toString();

    // fetching permission from db
    let userPermission;
    let noPermissionCase = false;

    if (req.body.userType === ROLE.SUPERADMIN) {
      userPermission = await getOne({
        model: db.SuperAdminUserPermission,
        data: { superAdminUserId: req.body.id },
        attributes: ["permission"],
      });
    } else if (req.body.userType === ROLE.ADMIN) {
      userPermission = await getOne({
        model: db.AdminUserPermission,
        data: { adminUserId: req.body.id },
        attributes: ["permission"],
      });
    }

    let action = REQUEST_TYPE[req.method];

    if (endPoint === "update-status") {
      if (!req.body.code)
        return res.status(401).json({ message: ERROR_MSG.PERMISSION_DENIED });
      if (CASINO_TOGGLE_CASE.includes(req.body.code)) noPermissionCase = true;

      endPoint = req.body.code;
      action = REQUEST_TYPE.TOGGLE;
    }

    if (endPoint === "update-theme-setting") {
      if (req.body.themeId) {
        if (
          !(await getOne({
            model: db.Theme,
            data: { themeId: req.body.themeId },
          }))
        ) {
          return res
            .status(422)
            .json({ message: "Theme Id " + ERROR_MSG.NOT_EXISTS });
        }

        action = REQUEST_TYPE.APPLY_THEME;
      } else {
        action = REQUEST_TYPE.CREATE_CUSTOM;
      }
    }

    if (RESPONSIBLE_GAMING_ENDPOINTS.includes(endPoint)) {
      action = REQUEST_TYPE.SET_RESET;
    }

    if (MANAGE_MONEY === endPoint) {
      action = REQUEST_TYPE.ADD_BALANCE;
    }

    if (TEST_EMAIL === endPoint) {
      action = REQUEST_TYPE.TEST_EMAIL;
    }

    if (BONUS_ACTIONS.includes(endPoint)) {
      action = REQUEST_TYPE.BONUS;
    }

    let permission = PERMISSION_TYPE.aliases[endPoint];
    let hasPermission = false;

    if (
      url.split("/").slice(-1).toString() === "update-status" &&
      req.body.userType === ROLE.ADMIN &&
      req.body.code === "ADMIN"
    )
      permission = "Admins";
    if (!noPermissionCase)
      hasPermission = userPermission.permission[permission].includes(action);
    if (hasPermission || noPermissionCase) next();
    else return res.status(406).json({ message: ERROR_MSG.PERMISSION_DENIED });
  } catch {
    res.status(406).json({ message: ERROR_MSG.PERMISSION_DENIED });
  }
};
