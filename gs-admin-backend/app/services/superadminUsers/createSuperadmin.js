/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { ROLE_ID } from "../../utils/constant";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { encryptPassword } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne } from "../helper/crud";

const constraints = {
  id: {
    presence: { allowEmpty: false },
  },
  userType: {
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
    presence: { allowEmpty: false },
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
    presence: { allowEmpty: false },
  },
  role: {
    presence: { allowEmpty: false },
  },
  adminId: {
    presence: false,
  },
  user: {
    presence: false,
  },
  group: {
    presence: false,
  },
};

export class CreateSuperadminUser extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      id,
      firstName,
      lastName,
      email,
      password,
      superAdminUsername,
      permission,
      role,
      adminId,
      user,
      userType,
      group,
    } = this.filteredArgs;
    let parentId = id;

    const t = await db.sequelize.transaction();

    try {
      email = email.toLowerCase();
      const checkAdminUserExist = await getOne({
        model: db.SuperAdminUser,
        data: { email },
      });

      if (checkAdminUserExist && checkAdminUserExist.email === email) {
        return this.addError(
          ERRORS.BAD_DATA,
          "Superadmin user " + ERROR_MSG.EXISTS
        );
      }

      const usernameCheck = await getOne({
        model: db.SuperAdminUser,
        data: { superAdminUsername },
      });
      if (usernameCheck)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);

      const superRole = await getOne({
        model: db.SuperadminRole,
        data: { name: role },
      });

      if (!superRole)
        return this.addError(
          ERRORS.BAD_DATA,
          "This role " + ERROR_MSG.NOT_EXISTS
        );

      if (
        superRole.superRoleId === ROLE_ID.SUPPORT &&
        (user.superRoleId === ROLE_ID.SUPERADMIN ||
          user.superRoleId === ROLE_ID.ADMIN)
      ) {
        // if (!adminId) return this.addError(ERRORS.BAD_DATA, 'Admin ' + ERROR_MSG.ID_REQUIRED)

        parentId = adminId;
      }

      if (user.superRoleId > superRole.superRoleId)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.CREATE_ERROR);

      const superadminUser = await getOne({
        model: db.SuperAdminUser,
        data: { superAdminUserId: parentId },
        include: { model: db.SuperadminRole },
      });

      if (!superadminUser)
        return this.addError(
          ERRORS.BAD_DATA,
          "Superadmin user " + ERROR_MSG.NOT_EXISTS
        );

      if (
        superRole.superRoleId === ROLE_ID.SUPPORT &&
        user.superRoleId === ROLE_ID.SUPERADMIN &&
        superadminUser.SuperadminRole.superRoleId !== ROLE_ID.ADMIN
      ) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.CREATE_ERROR);
      }
      if (superRole.superRoleId === ROLE_ID.SUPERADMIN)
        return this.addError(
          ERRORS.BAD_DATA,
          ERROR_MSG.CREATE_SUPERADMIN_ERROR
        );

      const newAdminUser = {
        firstName,
        lastName,
        email,
        password: encryptPassword(password),
        parentType: userType,
        parentId: parentId,
        superAdminUsername,
        superRoleId: superRole.superRoleId,
        userPermission: { permission },
        group,
      };

      const createAdminUser = await createNewEntity({
        model: db.SuperAdminUser,
        data: newAdminUser,
        include: [{ model: db.SuperAdminUserPermission, as: "userPermission" }],
        transaction: t,
      });

      delete createAdminUser.password;

      await t.commit();
      return { createAdminUser, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
