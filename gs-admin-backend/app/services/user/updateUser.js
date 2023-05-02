/* eslint-disable no-useless-escape */
import db from "../../db/models";
import { Op } from "sequelize";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { getOne, updateEntity } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  comparePassword,
  encryptPassword,
  keyFilter,
} from "../../utils/common";

const constraints = {
  userId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  user: {
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
  isEmailVerified: {
    type: "boolean",
    presence: false,
  },
  password: {
    presence: false,
  },
  phone: {
    format: {
      pattern: "^[0-9]{0,12}$",
      flags: "i",
      message: "%{value} is invalid",
    },
    presence: false,
  },
  phoneCode: {
    length: {
      minimum: 2,
      maximum: 5,
    },
    format: {
      pattern: "^[+0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  gender: {
    inclusion: {
      within: ["Female", "Male", "F", "M", "Not to say", "Other"],
      message: "can be (Female, Male, F, M, Not to say, Other)",
    },
    presence: { allowEmpty: false },
  },
  dateOfBirth: {
    format: {
      pattern:
        "^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d$$",
      message: "'%{value}' is invalid",
    },
    presence: { allowEmpty: false },
  },
  username: {
    format: {
      pattern: "^[A-Za-z][A-Za-z0-9_]{2,49}$",
      message:
        "'%{value}' is invalid (must start with alphabet, minimum length can be 3; can contain small case, upper case letters, digit and underscore)",
    },
    presence: false,
  },
  countryCode: {
    length: {
      minimum: 2,
      maximum: 3,
    },
    format: {
      pattern: "^[a-zA-Z]*$",
      flags: "i",
      message: "can only contain a-z and A-Z",
    },
    presence: { allowEmpty: false },
  },
  isActive: {
    type: "boolean",
    presence: false,
  },
  city: {
    length: {
      maximum: 100,
    },
    presence: false,
  },
  zipCode: {
    format: {
      pattern: "^[0-9]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  address: {
    length: {
      maximum: 250,
    },
    presence: { allowEmpty: false },
  },
  id: {
    presence: { allowEmpty: false },
  },
};

export class UpdateUserService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      userId,
      user,
      firstName,
      lastName,
      email,
      password,
      isEmailVerified,
      phone,
      phoneCode,
      gender,
      dateOfBirth,
      username,
      countryCode,
      isActive,
      city,
      zipCode,
      address,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      let query;
      if (user.adminRoleId !== 1) query = { parentId: user.parentId };

      const checkUserExists = await getOne({
        model: db.User,
        data: { userId, ...query },
      });

      if (!checkUserExists)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);

      if (!username) username = "";

      if (
        checkUserExists.email !== email ||
        (checkUserExists.username && checkUserExists.username !== username)
      ) {
        email = email.toLowerCase();
        const emailOrUsernameExist = await getOne({
          model: db.User,
          data: { [Op.or]: { email, username }, [Op.not]: { userId } },
          attributes: ["email", "username"],
        });

        if (emailOrUsernameExist) {
          if (emailOrUsernameExist.email === email) {
            return this.addError(ERRORS.BAD_DATA, ERROR_MSG.EMAIL_EXIST);
          } else if (emailOrUsernameExist.username === username) {
            return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);
          }
        }
      }

      let updateUser = {
        firstName,
        lastName,
        email,
        phone,
        phoneCode,
        gender,
        dateOfBirth,
        username,
        countryCode,
        city,
        zipCode,
        address,
      };

      if (
        password !== null &&
        password !== "" &&
        !(await comparePassword(password, checkUserExists.password))
      ) {
        updateUser = { ...updateUser, password: encryptPassword(password) };
      }

      if ("phone" in updateUser) {
        updateUser = { ...updateUser, phoneCode };
      }
      if ("address" in updateUser) {
        updateUser = { ...updateUser, zipCode, city };
      }

      const updatedUser = await updateEntity({
        model: db.User,
        values: { userId },
        data: {
          ...updateUser,
          isActive,
          isEmailVerified,
        },
        transaction: t,
      });

      await t.commit();
      return { updatedUser, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
