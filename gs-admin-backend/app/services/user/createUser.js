/* eslint-disable no-useless-escape */
import Jwt from "jsonwebtoken";
import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { encryptPassword, keyFilter } from "../../utils/common";
import { createNewEntity, getOne, updateEntity } from "../helper/crud";
import {
  ROLE,
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATE_TYPES,
} from "../../utils/constant";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";

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
  phoneCode: {
    length: {
      minimum: 2,
      maximum: 5,
    },
    format: {
      pattern: "^[+][0-9]+$",
      flags: "i",
      message: "%{value} is invalid",
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
  currencyCode: {
    length: {
      is: 3,
    },
    format: {
      pattern: "^[a-zA-Z]*$",
      flags: "i",
      message: "can only contain a-z and A-Z",
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
};

export class CreateUserService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      firstName,
      lastName,
      email,
      password,
      isEmailVerified,
      phone,
      phoneCode,
      gender,
      currencyCode,
      dateOfBirth,
      username,
      countryCode,
      isActive,
      city,
      zipCode,
      address,
      id,
      userType,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      email = email.toLowerCase();
      const checkUserExist = await getOne({
        model: db.User,
        data: { email },
        attributes: ["email"],
      });

      if (checkUserExist && checkUserExist.email === email) {
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.EXISTS);
      }

      if (username) {
        const usernameCheck = await getOne({
          model: db.User,
          data: { username },
        });
        if (usernameCheck)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);
      }

      let newUser = {
        firstName,
        lastName,
        email,
        password: encryptPassword(password),
        phone,
        phoneCode,
        gender,
        currencyCode,
        dateOfBirth,
        username,
        countryCode,
        city,
        zipCode,
        address,
      };

      if ("phone" in newUser) {
        newUser = { ...newUser, phoneCode };
      }
      if ("address" in newUser) {
        newUser = { ...newUser, zipCode, city };
      }

      if (!currencyCode)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.CURRENCY_REQUIRED);

      if (userType === ROLE.ADMIN) {
        const allowedCurrencies = (
          await getOne({ model: db.AdminUser, data: { adminUserId: id } })
        ).allowedCurrencies;
        if (!allowedCurrencies.includes(currencyCode))
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.CURRENCY_NOT_SUBSET);
      }

      const createUser = await createNewEntity({
        model: db.User,
        data: {
          ...newUser,
          parentId: id,
          parentType: userType,
          isActive,
          isEmailVerified,
          userWallet: {
            currencyCode,
            amount: 0,
            nonCashAmount: 0,
            winningAmount: 0,
            ownerType: ROLE.USER,
          },
        },
        include: [{ model: db.Wallet, as: "userWallet" }],
        transaction: t,
      });

      await t.commit();

      delete createUser.password;

      const credentials = await getSendGridCredentials();

      if (Object.keys(credentials).length === 2) {
        const emailToken = Jwt.sign(
          {
            userId: createUser.uniqueId,
          },
          process.env.EMAIL_TOKEN_KEY,
          { expiresIn: process.env.EMAIL_TOKEN_EXPIRY }
        );

        const dynamicEmail = await createEmailWithDynamicValues({
          emailType:
            EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[
              EMAIL_TEMPLATE_TYPES.EMAIL_VERIFICATION
            ],
          userId: createUser.userId,
          serviceData: {
            link: `${origin}/verify-email?emailToken=${emailToken}`,
            subject: EMAIL_SUBJECTS.verification,
          },
        });

        createUser.emailVerificationSent = await sendDynamicMail({
          user: createUser,
          credentials,
          subject: EMAIL_SUBJECTS.verification,
          successMsg: SUCCESS_MSG.VERIFICATION_EMAIL,
          dynamicEmail,
          senderName: "-------------",
        });

        if (createUser.emailVerificationSent.success) {
          createUser.emailToken = emailToken; // just for testing in postman

          await updateEntity({
            model: db.User,
            data: { emailToken },
            values: { userId: createUser.userId },
            transaction: t,
          });
        }
      }

      return { createUser, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
