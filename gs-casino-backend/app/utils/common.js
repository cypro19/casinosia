import _ from "lodash";
import axios from "axios";
import AWS from "aws-sdk";
import geoip from "geoip-lite";
import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
import { Op, Sequelize } from "sequelize";

import db from "../db/models";
import config from "../../config/app";
import { updateEntity, getOne, getAll } from "../services/helper/crud";
import {
  OK,
  UPLOAD_FILE_SIZE,
  SUCCESS,
  UPLOAD_DOCUMENT_SIZE,
} from "./constant";

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

export const keyFilter = (globalRegistration, user) => {
  const keysArray = Object.keys(globalRegistration).filter(
    (key) => globalRegistration[key] === 2 || globalRegistration[key] === 1
  );

  Object.keys(user).forEach(function (key) {
    if (!keysArray.includes(key)) delete user[key];
  });

  return user;
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

export const validateDocument = (res, files) => {
  if (!files || files?.length < 1) return "Documents not found";
  const documentCount = files.length;

  for (let document = 0; document < documentCount; document++) {
    if (files[document] && files[document].size > UPLOAD_DOCUMENT_SIZE) {
      return "File size too large";
    }

    if (files[document] && files[document].mimetype) {
      const fileType = files[document].mimetype.split("/")[1];
      const supportedFileType = [
        "png",
        "jpg",
        "jpeg",
        "tiff",
        "svg+xml",
        "pdf",
        "ott",
        "odt",
      ];

      if (!supportedFileType.includes(fileType)) {
        return "File type not supported";
      }
    }
  }

  return OK;
};

export const s3Client = () => {
  // configuring the AWS environment
  AWS.config.update({
    accessKeyId: config.get("aws.accessKey"),
    secretAccessKey: config.get("aws.secretAccessKey"),
  });

  return new AWS.S3();
};

export const uploadLogo = (logo, filename, key = undefined) => {
  filename = filename.split(" ").join("");

  const bucketParams = {
    Bucket: config.get("aws.bucket"),
    Key: filename,
    Body: logo.buffer,
    ACL: "public-read",
    ContentType: logo.mimetype,
  };

  if (key) {
    const deleteParams = {
      Bucket: config.get("aws.bucket"),
      Key: key,
    };
    s3Client().deleteObject(deleteParams).promise();
  }

  const logoS3 = s3Client().upload(bucketParams).promise();
  return logoS3;
};

export const removeLogo = (key) => {
  const deleteParams = {
    Bucket: config.get("aws.bucket"),
    Key: key,
  };

  s3Client().deleteObject(deleteParams).promise();
};

export const getUserRegistration = (registration) => {
  const dataArray = ["userId", "isEmailVerified", "isActive"];
  _.forEach(Object.keys(registration), (key) => {
    if (
      key === "confirmPassword" ||
      key === "password" ||
      key === "preferredLanguage" ||
      key === "newsLetter" ||
      key === "sms"
    ) {
    } else if (registration[key] === 2 || registration[key] === 1) {
      dataArray.push(key);
    }
  });

  if (dataArray.includes("phone")) dataArray.push("phoneCode");
  if (dataArray.includes("address")) {
    dataArray.push("zipCode");
    dataArray.push("city");
  }
  return dataArray;
};

export const updateUser = async (detail, req) => {
  await updateEntity({
    model: db.User,
    values: { userId: detail.userId },
    data: {
      signInCount: detail.signInCount + 1,
      signInIp:
        (req.headers["x-forwarded-for"] || "").split(",")[0] ||
        req.connection.remoteAddress,
      lastLoginDate: new Date(),
    },
  });
};

export const userIP = (req) => {
  return (
    (req.headers["x-forwarded-for"] || "").split(",")[0] ||
    req.connection.remoteAddress
  );
};

export const userId = (req) => {
  let token, response;

  if (
    req &&
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[0] === "Bearer"
  ) {
    token = req.headers["authorization"].split(" ")[1];

    const encodedPayload = token.split(".")[1];
    const payload = Buffer.from(encodedPayload, "base64");

    response = JSON.parse(payload.toString());
    if (response.role) return null;
    return response.id;
  }
  return null;
};

export const filterByName = (query, name) => {
  name = name.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
  query = { ...query, gameIdentifier: { [Op.iLike]: `%${name}%` } };

  return query;
};

export const filterByDate = (query, startDate = null, endDate = null) => {
  endDate = endDate || Date.now();

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("updated_at")),
          ">=",
          new Date(startDate)
        ),
        Sequelize.where(
          Sequelize.fn("date", Sequelize.col("updated_at")),
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
          Sequelize.fn("date", Sequelize.col("updated_at")),
          "<=",
          new Date(endDate)
        ),
      ],
    };
  }

  return query;
};

export const filterByActioneeNameEmail = (query, search) => {
  search = search
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
  query = {
    ...query,
    [Op.or]: [
      { actioneeEmail: { [Op.iLike]: `%${search}%` } },
      { actioneeName: { [Op.iLike]: `%${search}%` } },
    ],
  };

  return query;
};

export const decodeCredential = (data, object = false) => {
  if (!object)
    return CryptoJS.AES.decrypt(
      data,
      config.get("credentialsEncryptionKey")
    ).toString(CryptoJS.enc.Utf8);

  const credentials = [];

  data.forEach((credential) => {
    credential.value = CryptoJS.AES.decrypt(
      credential.value,
      config.get("credentialsEncryptionKey")
    ).toString(CryptoJS.enc.Utf8);
    credentials.push(credential);
  });

  return credentials;
};

export const getLocation = async (ipAddress) => {
  let country = "IN";
  let ip = await geoip.lookup(ipAddress);

  if (!ip) {
    ip = await axios.get("http://ip-api.com/json/" + `${ipAddress}`);

    if (ip.data.status === SUCCESS) country = ip.data.countryCode;
  } else {
    country = ip?.country;
  }

  const location = await getOne({
    model: db.Country,
    data: { code: country },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return location;
};

export const getPrimaryCurrencyAmount = async ({ currencyCode, amount }) => {
  let primaryCurrencyRate, secondaryCurrencyRate;

  const currencyDetail = await getAll({
    model: db.Currency,
    data: { [Op.or]: { code: currencyCode, isPrimary: true } },
    attributes: ["exchangeRate", "code"],
  });

  if (currencyDetail.length === 1) {
    primaryCurrencyRate = currencyDetail[0].exchangeRate;
    secondaryCurrencyRate = currencyDetail[0].exchangeRate;
  } else {
    if (currencyDetail[0].code === currencyCode) {
      primaryCurrencyRate = currencyDetail[1].exchangeRate;
      secondaryCurrencyRate = currencyDetail[0].exchangeRate;
    } else {
      primaryCurrencyRate = currencyDetail[0].exchangeRate;
      secondaryCurrencyRate = currencyDetail[1].exchangeRate;
    }
  }

  const conversionRate =
    parseFloat(secondaryCurrencyRate) / primaryCurrencyRate;
  amount = Math.abs((amount * conversionRate).toFixed(2));
  return { amount, conversionRate };
};

export const getGlobalRegistration = async () => {
  const globalRegistration = await getOne({
    model: db.GlobalSetting,
    data: { key: "GLOBAL_REGISTRATION" },
    raw: true,
    attributes: ["value"],
  });

  return JSON.parse(globalRegistration.value);
};

export const getOtherCurrenciesAmount = async ({ amount, currencyCode }) => {
  const currencies = await getAll({
    model: db.Currency,
    attributes: ["code", "exchangeRate"],
    raw: true,
  });

  const sourceExchangeRate = await currencies.find(
    (currency) => currency.code === currencyCode
  );
  const amountInOtherCurrencies = {};

  currencies.forEach((currency) => {
    const conversionRate =
      parseFloat(sourceExchangeRate.exchangeRate) / currency.exchangeRate;
    amountInOtherCurrencies[currency.code] = Math.abs(
      (amount * conversionRate).toFixed(2)
    );
  });

  return amountInOtherCurrencies;
};

export const liveLoginUser = async (msg) => {
  if (!msg?.userId) return;
  if (!msg?.deviceType) msg.deviceType = "desktop";

  const user = await getOne({
    model: db.User,
    data: { userId: msg.userId },
    attributes: ["userId", "loggedIn", "deviceType"],
  });

  await user
    .set({ loggedIn: user.loggedIn + 1, deviceType: msg.deviceType })
    .save();
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

export const liveLogoutUser = async (msg) => {
  if (!msg?.userId) return;

  const user = await getOne({
    model: db.User,
    data: { userId: msg.userId },
    attributes: ["userId", "loggedIn"],
  });

  if (user.loggedIn > 0) await user.set({ loggedIn: user.loggedIn - 1 }).save();
};

export const getLevelDetails = ({ loyaltyLevels, currentPoint }) => {
  let startPoint, endPoint;
  let level = 1;

  const lastLevel = loyaltyLevels[loyaltyLevels.length - 1];
  const firstLevel = loyaltyLevels[0];

  if (lastLevel.endPoint <= currentPoint) {
    return {
      startPoint: 0,
      endPoint: 0,
      maxLevel: true,
      level: lastLevel.level,
    };
  }

  if (currentPoint === 0) {
    return {
      startPoint: firstLevel.startPoint,
      endPoint: firstLevel.endPoint,
      maxLevel: false,
      level: firstLevel.level,
    };
  }

  loyaltyLevels.forEach((loyaltyLevel) => {
    if (
      loyaltyLevel.startPoint <= currentPoint &&
      loyaltyLevel.endPoint > currentPoint
    ) {
      startPoint = loyaltyLevel.startPoint;
      endPoint = loyaltyLevel.endPoint;
      level = loyaltyLevel.level;
    }
  });

  return { startPoint, endPoint, maxLevel: false, level };
};

export const filterByGameSubCategory = (query, search) => {
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

export const getDay = () => {
  const options = { weekday: "long" };
  const today = new Intl.DateTimeFormat("en-US", options).format(
    new Date(Date.now())
  );

  return today;
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
