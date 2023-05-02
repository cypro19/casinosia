import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { updateEntity } from "../helper/crud";
import { ERRORS } from "../../utils/errors";

const constraints = {
  email: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  password: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  firstName: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  lastName: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  dateOfBirth: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  address: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  countryCode: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  currencyCode: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },

  confirmPassword: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  username: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  phone: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  preferredLanguage: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  newsLetter: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  gender: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
  sms: {
    presence: true,
    type: "number",
    inclusion: {
      within: [0, 2],
      message: "can be 0 or 2",
    },
  },
};

export class UpdateGlobalRegistrationService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      email,
      password,
      confirmPassword,
      username,
      firstName,
      lastName,
      dateOfBirth,
      address,
      phone,
      gender,
      preferredLanguage,
      countryCode,
      newsLetter,
      currencyCode,
      sms,
    } = this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const updatedValues = {
        email,
        password,
        confirmPassword,
        username,
        firstName,
        lastName,
        dateOfBirth,
        address,
        phone,
        gender,
        preferredLanguage,
        countryCode,
        newsLetter,
        currencyCode,
        sms,
      };

      const updateGlobalRegistration = await updateEntity({
        model: db.GlobalSetting,
        values: { key: "GLOBAL_REGISTRATION" },
        data: { value: JSON.stringify(updatedValues) },
        transaction: t,
      });

      await t.commit();
      return { updateGlobalRegistration, message: SUCCESS_MSG.GET_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
