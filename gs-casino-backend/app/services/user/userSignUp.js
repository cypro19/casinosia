/* eslint-disable no-useless-escape */
import Jwt from "jsonwebtoken";

import db from "../../db/models";
import config from "../../../config/app";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import {
  encryptPassword,
  getGlobalRegistration,
  keyFilter,
} from "../../utils/common";
import { createNewEntity, getOne, updateEntity } from "../helper/crud";
import {
  DEFAULT_LANGUAGE,
  EMAIL_SUBJECTS,
  EMAIL_TEMPLATE_TYPES,
  ROLE,
  STATUS_VALUE,
} from "../../utils/constant";
import {
  createEmailWithDynamicValues,
  getSendGridCredentials,
  sendDynamicMail,
} from "../helper/email";
import {
  convertInCamelCase,
  createMyAffiliatePlayer,
  decodeMyAffiliateToken,
  getAffiliateDetails,
} from "../helper/myAffiliate";
import Logger from "../../common/logger";

const constraints = {
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
      pattern: "^[0-9a-zA-Z ]+$",
      flags: "i",
      message: "can only be alphanumeric.",
    },
    presence: false,
  },
  preferredLanguage: {
    presence: false,
  },
  address: {
    length: {
      maximum: 250,
    },
    presence: { allowEmpty: false },
  },
  uniqueKey: {
    presence: { allowEmpty: false },
  },
  ipAddress: {
    presence: true,
  },
  token: {
    presence: false,
  },
  siteName: {
    presence: { allowEmpty: false },
  },
  origin: {
    presence: { allowEmpty: false },
  },
};

export class UserSignUpService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    let {
      firstName,
      lastName,
      email,
      password,
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
      origin,
      uniqueKey,
      preferredLanguage,
      token,
      siteName,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      email = email.toLowerCase();
      const trackingToken = token;

      const checkUserExist = await getOne({
        model: db.User,
        data: { email },
        attributes: ["email"],
        transaction: t,
      });

      if (checkUserExist && checkUserExist.email === email)
        return this.addError(ERRORS.BAD_DATA, "User " + ERROR_MSG.EXISTS);

      if (username) {
        const usernameCheck = await getOne({
          model: db.User,
          data: { username },
          attributes: ["username"],
          transaction: t,
        });
        if (usernameCheck)
          return this.addError(ERRORS.BAD_DATA, ERROR_MSG.USERNAME_EXIST);
      }

      // Check My Affiliate token
      let affiliateStatus = false;
      let affiliateId = null;
      let isAffiliateUpdated = null;
      let affiliatesDetails;
      let affiliateError = false;

      if (trackingToken) {
        const tokenData = await decodeMyAffiliateToken({
          TOKENS: trackingToken,
        });
        console.log({ tokenData }, "TOKEN DATA=======");
        if (tokenData.success) {
          const affiliateData = await getAffiliateDetails({
            USER_ID: tokenData.data?.USER_ID,
          });
          console.log(affiliateData, "AFFILIATE DATA=======");
          if (affiliateData.success) {
            affiliatesDetails = convertInCamelCase(affiliateData.data);
            if (!affiliatesDetails) {
              affiliateError = true;
              isAffiliateUpdated = false;
            } else {
              let affiliate = await getOne({
                model: db.Affiliate,
                data: {
                  userIdAffiliate: affiliatesDetails.userIdAffiliate,
                  trackingToken,
                }, // need to ask if tracking token will be unique and not editable for each affiliate
                transaction: t,
              });

              if (!affiliate) {
                affiliate = await createNewEntity({
                  model: db.Affiliate,
                  data: { ...affiliatesDetails, trackingToken },
                  transaction: t,
                });
                console.log(affiliate, "NEW AFFILIATE DATA");
              }
              affiliateStatus = true;
              affiliateId = affiliate.affiliateId;
            }
          } else {
            affiliateError = true;
            isAffiliateUpdated = false;
          }
        } else {
          affiliateError = true;
          isAffiliateUpdated = false;
        }
        console.log(affiliatesDetails, "AFFILIATE DETAILS");
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
        preferredLanguage,
      };

      newUser = keyFilter(await getGlobalRegistration(), newUser);

      if ("phone" in newUser) {
        newUser = { ...newUser, phoneCode };
      }
      if ("address" in newUser) {
        newUser = { ...newUser, zipCode, city };
      }
      if (!currencyCode)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.CURRENCY_REQUIRED);

      const currency = await getOne({
        model: db.Currency,
        data: { code: currencyCode, isActive: true },
        attributes: ["code"],
        transaction: t,
      });

      if (!currency?.code)
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.CURRENCY_NOT_SUBSET);

      const createUser = await createNewEntity({
        model: db.User,
        data: {
          ...newUser,
          parentId: 1,
          parentType: ROLE.SUPERADMIN,
          isActive,
          isEmailVerified: false,
          kycStatus: STATUS_VALUE.PENDING,
          documentLabels: [],
          locale: preferredLanguage,
          affiliateStatus,
          trackingToken,
          isAffiliateUpdated,
          affiliateId,
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
      delete createUser.password;

      const checkUniqueKeyExists = await getOne({
        model: db.UniqueUserIdentification,
        data: { uniqueKey },
      });

      if (checkUniqueKeyExists && !checkUniqueKeyExists.userId) {
        await checkUniqueKeyExists
          .set({ userId: createUser.userId })
          .save({ transaction: t });
      } else {
        await createNewEntity({
          model: db.UniqueUserIdentification,
          data: { uniqueKey, userId: createUser.userId },
          transaction: t,
        });
      }

      await createNewEntity({
        model: db.Limit,
        data: { userId: createUser.userId },
        transaction: t,
      });

      await t.commit();

      try {
        if (trackingToken && !affiliateError) {
          const userDetails = {
            TOKEN: trackingToken,
            DISPLAY_NAME: createUser.username,
            CLIENT_GROUP: "affiliate-group", // Hard coded get this from my affiliate
            CLIENT_REFERENCE: createUser.userId,
            JOIN_DATE: new Date().toISOString().substring(0, 10),
            COUNTRY: countryCode,
          };

          const createUserMyAffiliate = await createMyAffiliatePlayer(
            userDetails
          );

          createUser.MyAffiliate = createUserMyAffiliate; // only for testing in development

          if (createUserMyAffiliate.success) {
            await updateEntity({
              model: db.User,
              data: { isAffiliateUpdated: true },
              values: { userId: createUser.userId },
            });
            createUser.isAffiliateUpdated = true;
          } else {
            await updateEntity({
              model: db.User,
              data: { isAffiliateUpdated: false },
              values: { userId: createUser.userId },
            });
            createUser.isAffiliateUpdated = false;
          }
        }

        const credentials = await getSendGridCredentials();

        if (Object.keys(credentials).length === 2) {
          const emailToken = Jwt.sign(
            {
              userId: createUser.uniqueId,
            },
            config.get("jwt.emailTokenKey"),
            { expiresIn: config.get("jwt.emailTokenExpiry") }
          );

          const dynamicEmail = await createEmailWithDynamicValues({
            language: createUser.locale || DEFAULT_LANGUAGE,
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
            senderName: siteName,
            dynamicEmail,
          });

          if (createUser.emailVerificationSent.success) {
            createUser.emailToken = emailToken; // just for testing in postman

            await updateEntity({
              model: db.User,
              data: { emailToken },
              values: { userId: createUser.userId },
            });
          }
        }
      } catch (error) {
        Logger.error("Error sending mail or affiliate error");
      }

      return { createUser, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
