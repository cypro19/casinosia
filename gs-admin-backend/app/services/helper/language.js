import db from "../../db/models";
import { createNewEntity, getOne } from "./crud";

export const checkLanguageExistsInDb = async (data) => {
  let languageList = [];
  const error = null;
  const success = true;

  const languages = await db.Language.findAll({
    attributes: ["code"],
    raw: true,
  });

  languages.forEach((language) => {
    languageList.push(language.code);
  });

  for (let index = 1; index < data.length; index++) {
    if (!languageList.includes(data[index]))
      return {
        error: `language code '${data[index]}' not found in your language configuration`,
        success: false,
      };
  }
  return { success, error };
};

export const checkKeysExists = async (data) => {
  const error = null;
  const success = true;

  const language = await getOne({
    model: db.MultiLanguageSupport,
    data: { language: "EN" },
    attributes: {
      exclude: ["multiLanguageSupportId", "createdAt", "updatedAt"],
    },
    raw: true,
  });

  delete language.language;

  const supportKeys = Object.keys(language);

  for (let index = 1; index < data.length; index++) {
    if (data[index].length === 0) {
      continue;
    }
    if (!supportKeys.includes(data[index][0]))
      return {
        error: `Language support key '${data[index][0]}' is not supported`,
        success: false,
      };
  }

  return { success, error };
};

export const filterFileData = async (data) => {
  const returnData = [];

  for (let index = 1; index < data[0].length; index++) {
    const newObject = { language: data[0][index] };
    for (let index2 = 1; index2 < data.length; index2++) {
      if (!data[index2][0]) continue;
      newObject[data[index2][0]] = data[index2][index];
    }
    returnData.push(newObject);
  }

  return returnData;
};

export const insertIntoDb = async (data) => {
  for (const language of data) {
    const getLanguageSupport = await getOne({
      model: db.MultiLanguageSupport,
      data: { language: language.language },
    });

    if (!getLanguageSupport) {
      await createNewEntity({
        model: db.MultiLanguageSupport,
        data: { ...language },
      });
    } else {
      const updatedData = {};

      Object.keys(language).forEach((supportKey) => {
        if (
          language[supportKey] &&
          getLanguageSupport[supportKey] !== language[supportKey]
        ) {
          updatedData[supportKey] = language[supportKey];
        }
      });

      if (Object.keys(updatedData).length !== 0) {
        await getLanguageSupport.set(updatedData).save();
      }
    }
  }
};
