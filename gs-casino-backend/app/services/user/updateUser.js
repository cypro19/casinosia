/* eslint-disable no-useless-escape */
import { Op } from "sequelize";

import db from "../../db/models";
import { getOne } from "../helper/crud";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  keyFilter,
  encryptPassword,
  comparePassword,
  getGlobalRegistration,
} from "../../utils/common";

const constraints = {
  id: {
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
    presence: false,
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
    presence: false,
  },
  dateOfBirth: {
    format: {
      pattern:
        "^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d$$",
      message: "'%{value}' is invalid",
    },
    presence: false,
  },
  username: {
    format: {
      pattern: "^[A-Za-z][A-Za-z0-9_]{2,49}$",
      message:
        "'%{value}' is invalid (must start with alphabet, minimum length can be 3; can contain small case, upper case letters, digit and underscore)",
    },
    presence: false,
  },
  preferredLanguage: {
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
      pattern: "^[0-9a-zA-Z ]+$",
      flags: "i",
      message: "can only be Integer.",
    },
    presence: false,
  },
  address: {
    length: {
      maximum: 250,
    },
    presence: false,
  },
  password: {
    presence: false,
  },
  user: {
    presence: { allowEmpty: false },
  },
};

export class UpdateUserService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      id,
      firstName,
      lastName,
      phone,
      phoneCode,
      gender,
      dateOfBirth,
      username,
      countryCode,
      city,
      zipCode,
      address,
      password,
      user,
      preferredLanguage,
    } = this.filteredArgs;

    try {
      if (!username) username = "";

      if (
        (user.username && user.username !== username) ||
        (username && user.username === null)
      ) {
        const usernameExist = await getOne({
          model: db.User,
          data: { [Op.or]: { username }, [Op.not]: { userId: id } },
          attributes: ["username"],
        });

        if (usernameExist && usernameExist.username === username) {
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);
        }
      }

      let updateUser = {
        firstName,
        lastName,
        phone,
        phoneCode,
        gender,
        dateOfBirth,
        username,
        countryCode,
        city,
        zipCode,
        address,
        preferredLanguage,
      };

      if (
        password &&
        password !== null &&
        password !== "" &&
        !(await comparePassword(password, user.password))
      ) {
        updateUser = { ...updateUser, password: encryptPassword(password) };
      }

      updateUser = keyFilter(await getGlobalRegistration(), updateUser);

      if ("phone" in updateUser) updateUser = { ...updateUser, phoneCode };
      if ("address" in updateUser)
        updateUser = { ...updateUser, zipCode, city };
      if ("preferredLanguage" in updateUser)
        updateUser = { ...updateUser, locale: preferredLanguage };

      await user.set({ ...updateUser }).save();

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
