/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, createNewEntity } from "../helper/crud";
import { encryptPassword } from "../../utils/common";

const constraints = {
  user: {
    presence: { allowEmpty: false },
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
    presence: { allowEmpty: false },
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
  username: {
    length: {
      minimum: 3,
      maximum: 50,
    },
    format: {
      pattern: "^[A-Za-z][A-Za-z0-9_]{2,49}$",
      flags: "i",
      message: "can only contain a-z , A-Z, 0-9 and _",
    },
    presence: { allowEmpty: false },
  },
  phone: {
    format: {
      pattern: "^[0-9]{0,12}$",
      flags: "i",
      message: "%{value} is invalid",
    },
    presence: false,
  },
  payoutPercentage: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  isActive: {
    type: "boolean",
    presence: { allowEmpty: false },
  },
};

export class CreateAffiliateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      user,
      email,
      password,
      firstName,
      lastName,
      username,
      phone,
      payoutPercentage,
      isActive,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      email = email.toLowerCase();
      const checkAffiliateExists = await getOne({
        model: db.Affiliate,
        data: { email },
        attributes: ["email"],
      });

      if (checkAffiliateExists && checkAffiliateExists.email === email) {
        return this.addError(ERRORS.BAD_DATA, "Affiliate " + ERROR_MSG.EXISTS);
      }

      const affiliate = {
        adminUserId: user.adminUserId,
        email,
        password: encryptPassword(password),
        firstName,
        lastName,
        username,
        phone,
        payoutPercentage,
        isActive,
      };

      const newAffiliate = await createNewEntity({
        model: db.Affiliate,
        data: affiliate,
        transaction: t,
      });

      delete newAffiliate.password;

      await t.commit();
      return { newAffiliate, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
