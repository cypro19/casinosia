import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { themeAttributes } from "../../utils/common";
import { ERRORS, ERROR_MSG } from "../../utils/errors";
import { createNewEntity, getOne } from "../helper/crud";

const constraints = {
  themeName: {
    length: {
      minimum: 2,
      maximum: 50,
    },
    format: {
      pattern: "^[a-z_ A-Z0-9]+$",
      flags: "i",
      message: "can only contain a-z, A-Z, _, 0-9 and space",
    },
    presence: { allowEmpty: false },
  },
  themeMode: {
    inclusion: {
      within: ["dark", "light", "Dark", "Light", "DARK", "LIGHT"],
      message: "'%{value}' is not allowed",
    },
    presence: { allowEmpty: false },
  },
  primaryColor: {
    length: {
      minimum: 3,
      maximum: 50,
    },
    presence: { allowEmpty: false },
  },
  secondaryColor: {
    length: {
      minimum: 3,
      maximum: 50,
    },
    presence: { allowEmpty: false },
  },
};

export class CreateThemesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { themeName, themeMode, primaryColor, secondaryColor } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkThemeExist = await getOne({
        model: db.Theme,
        data: { themeName },
      });

      if (checkThemeExist) {
        return this.addError(ERRORS.BAD_DATA, "Theme " + ERROR_MSG.EXISTS);
      }

      const createTheme = await createNewEntity({
        model: db.Theme,
        data: {
          themeName,
          themeMode: themeMode.toLowerCase(),
          primaryColor,
          secondaryColor,
          themeOptions: themeAttributes(
            themeMode,
            primaryColor,
            secondaryColor
          ),
        },
        transaction: t,
      });

      await t.commit();
      return { createTheme, message: SUCCESS_MSG.CREATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
