/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { getOne, updateEntity } from "../helper/crud";
import { comparePassword, encryptPassword } from "../../utils/common";

const constraints = {
  affiliateId: {
    type: "integer",
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
    presence: false,
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
  user: {
    presence: { allowEmpty: false },
  },
};

export class UpdateAffiliateService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      affiliateId,
      email,
      password,
      firstName,
      lastName,
      username,
      phone,
      payoutPercentage,
      isActive,
      user,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkAffiliateExists = await getOne({
        model: db.Affiliate,
        data: { affiliateId },
      });

      if (!checkAffiliateExists) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      email = email.toLowerCase();
      if (checkAffiliateExists.email !== email) {
        const emailExists = await getOne({
          model: db.Affiliate,
          data: { email },
        });

        if (emailExists)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.EMAIL_EXIST);
      }

      let affiliate = {
        adminUserId: user.adminUserId,
        firstName,
        lastName,
        username,
        email,
        phone,
        payoutPercentage,
        isActive,
      };

      if (
        password !== null &&
        password !== "" &&
        !(await comparePassword(password, checkAffiliateExists.password))
      ) {
        affiliate = { ...affiliate, password: encryptPassword(password) };
      }

      const updatedAffiliate = await updateEntity({
        model: db.Affiliate,
        values: { affiliateId },
        data: affiliate,
        transaction: t,
      });

      await t.commit();
      return { updatedAffiliate, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
