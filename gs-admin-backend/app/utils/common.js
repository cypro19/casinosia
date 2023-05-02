import _ from "lodash";
import sharp from "sharp";
import AWS from "aws-sdk";
import bcrypt from "bcrypt";
import db from "../db/models";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";
import config from "../../config/app";
import { getOne, getAll } from "../services/helper/crud";
import { internationalNumberFormatter } from "../services/helper/elastic";
import {
  OK,
  ROLE,
  STRICTLY_REQUIRED_REGISTRATION_FIELDS,
  UPLOAD_FILE_SIZE,
} from "./constant";
import CryptoJS from "crypto-js";
import encode from "crypto-js/enc-hex";

export const comparePassword = async (password, userPassword) => {
  if (!password) {
    return false;
  }

  const result = await bcrypt.compare(
    Buffer.from(password, "base64").toString("ascii"),
    userPassword
  );

  return result;
};

export const signAccessToken = async ({ name, email, id, role }) => {
  const payload = { email, id, name, role };

  const jwtToken = jwt.sign(payload, config.get("jwt.loginTokenSecret"), {
    expiresIn: config.get("jwt.loginTokenExpiry"),
  });

  return jwtToken;
};

export const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(
    Buffer.from(password, "base64").toString("ascii"),
    salt
  );
};

export const filterByNameEmail = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(
        Sequelize.fn(
          "concat",
          Sequelize.col("first_name"),
          " ",
          Sequelize.col("last_name")
        ),
        {
          [Op.iLike]: `%${search}%`,
        }
      ),
      { email: { [Op.iLike]: `%${search}%` } },
    ],
  };

  return query;
};

export const filterByTitleSlugContent = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [
      { title: { [Op.iLike]: `%${search}%` } },
      { slug: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
    ],
  };

  return query;
};

export const filterByName = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
  };
  return query;
};

export const filterByEmailName = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ],
  };
  return query;
};

export const filterByDate = (
  query,
  startDate = null,
  endDate = null,
  modelName
) => {
  endDate = endDate || Date.now();

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.updated_at`)),
          ">=",
          new Date(startDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.updated_at`)),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.updated_at`)),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  }

  return query;
};

export const filterByDateCreatedAt = (
  query,
  startDate = null,
  endDate = null,
  modelName
) => {
  endDate = endDate || Date.now();

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.created_at`)),
          ">=",
          new Date(startDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.created_at`)),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col(`${modelName}.created_at`)),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  }

  return query;
};

export const pageValidation = (pageNo, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(pageNo);
  const sizeAsNumber = Number.parseInt(limit);
  let page = 1;
  let size = 15;

  if (
    Number.isNaN(pageAsNumber) ||
    pageAsNumber < 0 ||
    Number.isNaN(sizeAsNumber) ||
    sizeAsNumber < 0 ||
    sizeAsNumber > maxSize
  ) {
    return { page, size };
  }

  size = sizeAsNumber;
  page = pageAsNumber;

  return { page, size };
};

export const keyFilter = (siteRegistration, user) => {
  const keysArray = Object.keys(siteRegistration.dataValues).filter(
    (key) => siteRegistration[key] === 2 || siteRegistration[key] === 1
  );

  Object.keys(user).forEach(function (key) {
    if (!keysArray.includes(key)) {
      delete user[key];
    }
  });

  return user;
};

const s3Client = () => {
  // configuring the AWS environment
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return new AWS.S3();
};

function LightenDarkenColor(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = "#";
  let c;
  let i;

  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

const lightColor = (color, value) => {
  for (let i = 0; i <= 1; i = i + 0.3) {
    const colorVariation = i.toFixed(1);
    const newColor = LightenDarkenColor(color, colorVariation);
    value[`light_${colorVariation * 100}`] = newColor;
  }

  return value;
};

const darkColor = (color, value) => {
  for (let i = 0; i <= 1; i = i + 0.3) {
    const colorVariation = i.toFixed(1);
    const newColor = LightenDarkenColor(color, colorVariation * -1);
    value[`dark_${colorVariation * 100}`] = newColor;
  }

  return value;
};

export const themeAttributes = (mode, primaryColor, secondaryColor) => {
  mode = mode.toLowerCase();

  let primary = { main: primaryColor };
  primary = { ...primary, ...darkColor(primaryColor, primary) };
  primary = { ...primary, ...lightColor(secondaryColor, primary) };

  let secondary = { main: secondaryColor };
  secondary = { ...secondary, ...darkColor(secondaryColor, secondary) };
  secondary = { ...secondary, ...lightColor(secondaryColor, secondary) };

  return { palette: { mode, primary, secondary } };
};

export const validateFile = (res, file) => {
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return "File size too large";
  }

  if (file && file.mimetype) {
    const fileType = file.mimetype.split("/")[1];
    const supportedFileType = ["png", "jpg", "jpeg", "tiff", "svg+xml"];

    if (!supportedFileType.includes(fileType)) {
      return "File type not supported";
    }
  }

  return OK;
};

export const uploadLogo = (logo, filename, key = undefined) => {
  filename = filename.split(" ").join("");

  const bucketParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: filename,
    Body: logo.buffer,
    ACL: "public-read",
    ContentType: logo.mimetype,
  };

  if (key) {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    };
    s3Client().deleteObject(deleteParams).promise();
  }

  const logoS3 = s3Client().upload(bucketParams).promise();
  return logoS3;
};

export const getKey = (fileName) => {
  const key = fileName.split("amazonaws.com/")[1];
  return key;
};

export const dimensionCheck = async (image, height, width) => {
  const size = await sharp(image.buffer).metadata();
  if (height !== size.height && width !== size.width) {
    return false;
  }
  return OK;
};

export const removeItems = (array, itemsToRemove) => {
  return array.filter((v) => {
    return !itemsToRemove.includes(v);
  });
};

export const encodeCredential = (key) => {
  return CryptoJS.AES.encrypt(
    key,
    process.env.CREDENTIAL_ENCRYPTION_KEY
  ).toString();
};

export const decodeCredential = (data, object = false) => {
  if (!object)
    return CryptoJS.AES.decrypt(
      data,
      process.env.CREDENTIAL_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
  console.log(object, "------object---------");
  const credentials = [];

  data.forEach((credential) => {
    credential.value = CryptoJS.AES.decrypt(
      credential.value,
      process.env.CREDENTIAL_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    credentials.push(credential);
  });

  return credentials;
};

export const filterByNameDomain = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { domain: { [Op.iLike]: `%${search}%` } },
    ],
  };
  return query;
};

export const getGlobalRegistration = async (Registration) => {
  let globalRegistration = await getOne({
    model: db.GlobalSetting,
    data: { key: "GLOBAL_REGISTRATION" },
    raw: true,
    attributes: ["value"],
  });
  globalRegistration = JSON.parse(globalRegistration.value);

  const disable = [];
  Object.keys(Registration.dataValues).forEach((key) => {
    if (globalRegistration[key] === 2) {
      Registration.dataValues[key] = 2;
      disable.push(key);
    }
  });

  Registration.dataValues.disable = [
    ...new Set(disable.concat(STRICTLY_REQUIRED_REGISTRATION_FIELDS)),
  ];

  return Registration;
};

export const getPrimaryCurrencyAmount = async ({ currencyCode, amount }) => {
  const primaryCurrency = await getOne({
    model: db.Currency,
    data: { isPrimary: true },
  });

  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ["exchangeRate"],
  });

  const conversionRate =
    parseFloat(sourceExchangeRate.exchangeRate) / primaryCurrency.exchangeRate;
  amount = Math.abs((amount * conversionRate).toFixed(2));
  return { amount, conversionRate };
};

export const topPlayerResponse = (data) => {
  const response = [];
  data.forEach((object) => {
    const newData = {};
    Object.keys(object).forEach((key) => {
      newData[key.split(".")[key.split(".").length - 1]] = object[key];
      if (
        key.split(".")[key.split(".").length - 1] === "amount" ||
        key.split(".")[key.split(".").length - 1] === "depositAmount"
      ) {
        newData[key.split(".")[key.split(".").length - 1]] =
          internationalNumberFormatter(object[key]);
      }
    });
    response.push(newData);
  });
  return response;
};

export const getOtherCurrenciesAmount = async ({
  amount,
  primary,
  currencyCode,
}) => {
  const sourceExchangeRate = await getOne({
    model: db.Currency,
    data: { code: currencyCode },
    attributes: ["exchangeRate"],
    raw: true,
  });

  if (primary) {
    const primaryCurrency = await getOne({
      model: db.Currency,
      data: { isPrimary: true },
      raw: true,
    });
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) /
      primaryCurrency.exchangeRate;
    amount = Math.abs((amount * conversionRate).toFixed(2));
    return { amount, conversionRate };
  }

  const targetCurrencies = await getAll({
    model: db.Currency,
    raw: true,
  });

  const amountInOtherCurrencies = {};

  targetCurrencies.forEach((currency) => {
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) / currency.exchangeRate;
    amountInOtherCurrencies[currency.code] = Math.abs(
      (amount * conversionRate).toFixed(2)
    );
  });

  return amountInOtherCurrencies;
};

export const setLoyaltySequence = (levels) => {
  const returnList = [];
  levels.forEach((level) => {
    returnList.push({
      level: level.level,
      startPoint: level.startPoint,
      endPoint: level.endPoint,
      cashback_multiplier: level.cashback_multiplier,
    });
  });
  return returnList;
};

export const getGameAggregatorAndProvider = async ({ game }) => {
  const gameData = await db.MasterCasinoGame.findOne({
    where: { identifier: game },
    attributes: [],
    include: [
      {
        model: db.MasterCasinoProvider,
        attributes: ["name", "masterCasinoProviderId"],
        include: [
          {
            model: db.MasterGameAggregator,
            attributes: ["name"],
          },
        ],
      },
    ],
    raw: true,
  });
  return {
    aggregator: gameData["MasterCasinoProvider.MasterGameAggregator.name"],
    provider: gameData["MasterCasinoProvider.name"],
    providerId: gameData["MasterCasinoProvider.masterCasinoProviderId"],
  };
};

export const filterByNameEmailGroup = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(
        Sequelize.fn(
          "concat",
          Sequelize.col("first_name"),
          " ",
          Sequelize.col("last_name")
        ),
        {
          [Op.iLike]: `%${search}%`,
        }
      ),
      { email: { [Op.iLike]: `%${search}%` } },
      { group: { [Op.iLike]: `%${search}%` } },
    ],
  };
  return query;
};

export const getLiabilityQuery = ({ adminId }) => {
  let returnQuery;

  const upperQuery = `
  SELECT ROUND(cast(sum(wallet.amount) as numeric),2) as liability, my_user.currency_code as "currencyCode" from public.users as my_user
  JOIN public.wallets as wallet on wallet.owner_id = my_user.user_id AND wallet.owner_type = 'user'
  `;

  const lowerQuery = `
  GROUP BY my_user.currency_code
  `;

  let middleQuery;

  if (adminId) {
    if (!middleQuery)
      middleQuery = `WHERE my_user.parent_id = ${adminId} AND my_user.parent_type = ${ROLE.ADMIN} `;
    if (middleQuery)
      middleQuery += ` AND my_user.parent_id = ${adminId} AND my_user.parent_type = ${ROLE.ADMIN}  `;
    returnQuery = upperQuery + middleQuery + lowerQuery;
  } else {
    if (middleQuery) returnQuery = upperQuery + middleQuery + lowerQuery;
    else returnQuery = upperQuery + lowerQuery;
  }

  return returnQuery;
};

export const removeByAttr = (arr, attr, value) => {
  var index = arr.length;
  while (index--) {
    if (arr[index] && arr[index][attr] === value) {
      arr.splice(index, 1);
    }
  }
  return arr;
};

export const removeLogo = (key) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };

  s3Client().deleteObject(deleteParams).promise();
};

export const getAllPortalUserIds = async (email) => {
  const userIds = [];

  const accounts = await getAll({
    model: db.User,
    data: { email },
    attributes: ["userId"],
    raw: true,
  });

  for (const user of accounts) {
    userIds.push(user.userId);
  }

  return userIds;
};

export const getDetails = async ({ currency, country }) => {
  let currencyId, countryName;

  if (currency) {
    const details = await getOne({
      model: db.Currency,
      data: { code: currency },
      attributes: ["currencyId"],
    });
    currencyId = details.currencyId;
  }

  if (country) {
    const details = await getOne({
      model: db.Country,
      data: { code: country },
      attributes: ["name"],
    });
    countryName = details.name;
  }

  return { currencyId, countryName };
};

export const getUserDetails = async (userId) => {
  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    include: [{ model: db.Wallet, as: "userWallet" }],
  });

  return userDetails;
};

export const secureData = ({ data, key }) => {
  return CryptoJS.HmacMD5(data, key).toString(encode);
};

export const filterByLanguageName = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [{ languageName: { [Op.iLike]: `%${search}%` } }],
  };
  return query;
};
