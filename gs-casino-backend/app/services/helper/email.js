import db from "../../db/models";
import sgMail from "@sendgrid/mail";

import { getOne } from "../helper/crud";
import { ERROR_MSG } from "../../utils/errors";
import { decodeCredential } from "../../utils/common";
import getSymbolFromCurrency from "currency-symbol-map";

export const sendMail = async ({
  user,
  credentials,
  dataValues,
  successMsg,
  templateId,
}) => {
  sgMail.setApiKey(credentials.apiKey);

  const msg = {
    to: user.email,
    from: credentials.apiEmail,
    templateId,
    dynamic_template_data: dataValues,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: successMsg };
  } catch {
    return { success: false, message: ERROR_MSG.SENDGRID_ERROR };
  }
};

export const sendDynamicMail = async ({
  user,
  credentials,
  subject,
  successMsg,
  dynamicEmail,
  senderName,
}) => {
  sgMail.setApiKey(credentials.apiKey);

  const msg = {
    to: user.email,
    from: {
      name: senderName || "Casino Gaming",
      email: credentials.apiEmail,
    },
    subject: subject,
    text: subject,
    html: dynamicEmail,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: successMsg };
  } catch {
    return { success: false, message: ERROR_MSG.SENDGRID_ERROR };
  }
};

export const getSendGridCredentials = async () => {
  const credentials = await db.GlobalSetting.findAll({
    attributes: ["key", "value"],
    where: { key: ["SENDGRID_API_KEY", "SENDGRID_EMAIL"] },
    raw: true,
  });

  const mainCredentials = {};

  credentials.forEach((credential) => {
    if (credential.key === "SENDGRID_API_KEY" && credential.value) {
      mainCredentials.apiKey = decodeCredential(credential.value);
    } else if (credential.key === "SENDGRID_EMAIL" && credential.value) {
      mainCredentials.apiEmail = decodeCredential(credential.value);
    }
  });

  return mainCredentials;
};

export const getDynamicData = async ({ userId, currentDataList }) => {
  const origin = (
    await getOne({ model: db.GlobalSetting, data: { key: "ORIGIN" } })
  )?.value;
  const siteName = (
    await getOne({ model: db.GlobalSetting, data: { key: "SITE_NAME" } })
  )?.value;
  const logoUrl = (
    await getOne({ model: db.GlobalSetting, data: { key: "LOGO_URL" } })
  )?.value;

  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    include: [{ model: db.Wallet, as: "userWallet" }],
  });

  const dynamicData = {
    siteName: siteName,
    siteLogo: logoUrl,
    siteUrl: origin,
    playerEmail: userDetails.email,
    playerFullName: userDetails.firstName + " " + userDetails.lastName,
    playerFirstName: userDetails.firstName,
    playerLastName: userDetails.lastName,
    userName: userDetails.username,
    walletAmountTotal: parseFloat(
      (
        userDetails.userWallet.amount + userDetails.userWallet.nonCashAmount
      ).toFixed(2)
    ),
    walletAmountBonus: parseFloat(
      userDetails.userWallet.nonCashAmount.toFixed(2)
    ),
    walletAmountReal: parseFloat(userDetails.userWallet.amount.toFixed(2)),
    siteLoginUrl: `${origin}/login`,
    sendSupportRequestRoute: `${origin}/support-mail`,
    playerCurrencySymbol: getSymbolFromCurrency(userDetails.currencyCode),
    subject: "-",
    reason: "-",
    link: "-",
    withdrawAmount: "-",
    depositAmount: "-",
    transactionId: "-",
    supportEmailAddress: "-",
    kycLabels: "-",
  };

  return { ...dynamicData, ...currentDataList };
};

export const insertDynamicDataInTemplate = ({ template, dynamicData }) => {
  let returnEmail = template;

  Object.keys(dynamicData).forEach((dynamicKey) => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, "g");
    returnEmail = returnEmail.replaceAll(pattern, dynamicData[dynamicKey]);
  });

  return returnEmail;
};

export const createEmailWithDynamicValues = async ({
  emailType,
  userId,
  serviceData,
  language,
}) => {
  let dynamicData = { ...serviceData };

  const templateDetails = await db.EmailTemplate.findOne({
    where: { isDefault: true, type: emailType },
    raw: true,
  });

  dynamicData = {
    ...(await getDynamicData({
      userId,
      dataList: templateDetails.dynamicData,
      currentDataList: dynamicData,
    })),
  };

  const emailData = insertDynamicDataInTemplate({
    template:
      templateDetails.templateCode[language] ||
      templateDetails.templateCode["EN"],
    dynamicData,
  });

  return emailData;
};

export const insertDynamicDataInCmsTemplate = ({ template, dynamicData }) => {
  let returnCms = template;

  Object.keys(dynamicData).forEach((dynamicKey) => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, "g");
    returnCms = returnCms.replaceAll(pattern, dynamicData[dynamicKey]);
  });

  return returnCms;
};

export const getDynamicDataValue = async () => {
  const supportEmailAddress = (
    await getOne({
      model: db.GlobalSetting,
      data: { key: "SUPPORT_EMAIL_ADDRESS" },
    })
  )?.value;
  const siteName = (
    await getOne({ model: db.GlobalSetting, data: { key: "SITE_NAME" } })
  )?.value;
  const logoUrl = (
    await getOne({ model: db.GlobalSetting, data: { key: "LOGO_URL" } })
  )?.value;

  const dynamicData = {
    siteName: siteName,
    siteLogo: logoUrl,
    supportEmailAddress,
  };

  return dynamicData;
};
