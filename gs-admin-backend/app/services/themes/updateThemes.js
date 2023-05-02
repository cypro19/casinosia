import db from "../../db/models";
import { SUCCESS_MSG } from "../../utils/success";
import ServiceBase from "../../common/serviceBase";
import { themeAttributes } from "../../utils/common";
import { updateEntity, getOne } from "../helper/crud";
import { ERRORS, ERROR_MSG } from "../../utils/errors";

const constraints = {
  themeId: {
    type: "integer",
    presence: { allowEmpty: false },
  },
  themeName: {
    length: {
      minimum: 2,
      maximum: 50,
    },
    format: {
      pattern: "^[a-z_ A-Z0-9]*$",
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

export class UpdateThemesService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { themeId, themeName, themeMode, primaryColor, secondaryColor } =
      this.filteredArgs;

    const t = await db.sequelize.transaction();

    try {
      const checkThemeExist = await getOne({
        model: db.Theme,
        data: { themeId },
      });

      if (!checkThemeExist) {
        return this.addError(ERRORS.BAD_DATA, ERROR_MSG.NOT_FOUND);
      }

      const checkThemeNameExist = await getOne({
        model: db.Theme,
        data: { themeName },
      });

      if (checkThemeNameExist && checkThemeNameExist.themeId !== themeId) {
        return this.addError(ERRORS.BAD_DATA, "Theme name " + ERROR_MSG.EXISTS);
      }

      const updateTheme = await updateEntity({
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
        values: { themeId },
        transaction: t,
      });

      await t.commit();
      return { updateTheme, message: SUCCESS_MSG.UPDATE_SUCCESS };
    } catch (error) {
      await t.rollback();
      this.addError(ERRORS.INTERNAL, error);
    }
  }
}
