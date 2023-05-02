/* eslint-disable no-useless-escape */
import { Op } from "sequelize";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity, getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { comparePassword, encryptPassword } from "../../utils/common";

const constraints = {
  superAdminId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  firstName: {
    length: {
      minimum: 3,
      maximum: 50,
    },
    format: {
      pattern: "^[a-zA-Z0-9]*$",
      flags: "i",
      message: "can only contain a-z, A-Z and 0-9",
    },
  },
  lastName: {
    length: {
      maximum: 50,
    },
    format: {
      pattern: "^[a-zA-Z0-9]*$",
      flags: "i",
      message: "can only contain a-z, A-Z and 0-9",
    },
  },
  email: {
    length: {
      maximum: 150,
    },
    format: {
      pattern:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "%{value} is not a valid email",
    },
    presence: { allowEmpty: false },
  },
  password: {
    presence: false,
  },
  superAdminUsername: {
    length: {
      minimum: 3,
      maximum: 50,
    },
    format: {
      pattern: "^[A-Za-z][A-Za-z0-9_]{3,50}$",
      flags: "i",
      message: "can only contain a-z and A-Z",
    },
    presence: { allowEmpty: false },
  },
  permission: {
    presence: false,
  },
  id: {
    presence: { allowEmpty: false },
  },
  group: {
    presence: false,
  },
};
export class UpdateSuperadminUser extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      superAdminId,
      firstName,
      lastName,
      email,
      password,
      superAdminUsername,
      permission,
      id,
      group,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const query = { superAdminUserId: superAdminId };

      const checkSuperadminUserExist = await getOne({
        model: db.SuperAdminUser,
        data: query,
      });

      if (!checkSuperadminUserExist)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      if (
        checkSuperadminUserExist.superAdminUserId !== id &&
        checkSuperadminUserExist.superRoleId === 1
      ) {
        //return this.addError(ERRORS.UNAUTHORIZED, ERROR_MSG.PERMISSION_DENIED)
      }
      if (
        checkSuperadminUserExist.email !== email ||
        checkSuperadminUserExist.superAdminUsername !== superAdminUsername
      ) {
        email = email.toLowerCase();

        const emailOrUsernameExist = await getOne({
          model: db.SuperAdminUser,
          data: {
            [Op.or]: { email, superAdminUsername },
            [Op.not]: { superAdminUserId: superAdminId },
          },
          attributes: ["email", "superAdminUsername"],
        });

        if (emailOrUsernameExist) {
          if (emailOrUsernameExist.email === email) {
            return this.addError(ERRORS.BAD_DATA, ERROR_MSG.EMAIL_EXIST);
          }
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);
        }
      }

      let updateSuperadminUser = {
        firstName,
        lastName,
        email,
        superAdminUsername,
        group,
      };

      if (
        password !== null &&
        password !== "" &&
        !(await comparePassword(password, checkSuperadminUserExist.password))
      ) {
        updateSuperadminUser = {
          ...updateSuperadminUser,
          password: encryptPassword(password),
        };
      }

      const updatedSuperadminUser = await updateEntity({
        model: db.SuperAdminUser,
        values: { superAdminUserId: superAdminId },
        data: updateSuperadminUser,
        transaction: t,
      });

      const updatePermissions = { permission };

      const updatedPermissions = await updateEntity({
        model: db.SuperAdminUserPermission,
        values: { superAdminUserId: superAdminId },
        data: updatePermissions,
        transaction: t,
      });

      await t.commit();
      return {
        superadminDetail: { updatedSuperadminUser, updatedPermissions },
        message: SUCCESS_MSG.UPDATE_SUCCESS,
      };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
