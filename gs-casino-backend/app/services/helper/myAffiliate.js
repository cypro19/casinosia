import axios from "axios";
import config from "../../../config/app";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import _ from "lodash";

export const convertInCamelCase = (data) => {
  return _.mapKeys(data, (value, key) => _.camelCase(key));
};

const getMyAffiliateAuthToken = () => {
  const token = `${config.get("myAffiliate.apiUsername")}:${config.get(
    "myAffiliate.apiPassword"
  )}`;
  return {
    authorization: `Basic ${Buffer.from(token).toString("base64")}`,
    "Accept-Encoding": "*",
  };
};

const getAffiliateUserPersonalDetails = (details) => {
  if (details) {
    const returnData = {};
    details.forEach((detail) => {
      returnData[detail?.["@_NAME"]?.toUpperCase()] = detail?.["@_VALUE"];
    });

    return returnData;
  } else {
    return {
      COMPANY: "",
      DOB: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      MARKETING: "",
      MOBILE: "",
      SKYPE: "",
      TERMSAGREEMENT: "",
      WEBSITE: "",
    };
  }
};

const myAffiliateResponseSuccess = ({ response, feed }) => {
  let data = response.data;
  if (!XMLValidator.validate(response.data))
    return { success: true, statusCode: response.status, data };
  data = new XMLParser({ ignoreAttributes: false }).parse(response.data);
  delete data["?xml"];

  if (feed === 4) {
    data = {
      USER_ID: data?.TOKENS?.TOKEN?.["@_USER_ID"],
      USERNAME: data?.TOKENS?.TOKEN?.USER?.["@_USERNAME"],
      EMAIL: data?.TOKENS?.TOKEN?.USER?.["@_EMAIL"],
      STATUS: data?.TOKENS?.TOKEN?.USER?.["@_STATUS"],
      SOURCE_IP: data?.TOKENS?.TOKEN?.["@_IP_ADDRESS"],
      SOURCE_COUNTRY: data?.TOKENS?.TOKEN?.["@_COUNTRY"],
      TIME_STAMP: data?.TOKENS?.TOKEN?.["@_TIME_STAMP"],
    };
  } else if (feed === 1) {
    data = data["USERS"]["USER"];
    data = {
      USER_ID_AFFILIATE: data["@_ID"],
      ...data,
      ...getAffiliateUserPersonalDetails(data?.["USER_DETAILS"]["DETAIL"]),
    };
    data.PARENT_ID_AFFILIATE = data?.["PARENT_ID"];
    data.ADMIN_ID_AFFILIATE = data?.["ADMIN_ID"];
    data.TERMS_AGREEMENT = data?.["TERMSAGREEMENT"];
    data.OTHER_DETAILS = {
      LANGUAGE: data?.["LANGUAGE"] || null,
      USER_COMMENTS: data?.["USER_COMMENTS"] || null,
      USER_TAGS: data?.["USER_TAGS"] || null,
      USER_CAMPAIGNS: data?.["USER_CAMPAIGNS"] || null,
      USER_VARIABLES: data?.["USER_VARIABLES"] || null,
      USER_PAYMENT_DETAILS: data?.["USER_PAYMENT_DETAILS"] || null,
      SUBSCRIPTIONS: data?.["SUBSCRIPTIONS"] || null,
      SUBSCRIPTION_VARIABLES: data?.["SUBSCRIPTION_VARIABLES"] || null,
    };

    delete data?.["TERMSAGREEMENT"];
    delete data?.["ADMIN_ID"];
    delete data?.["PARENT_ID"];
    delete data?.["USER_VARIABLES"];
    delete data?.["LANGUAGE"];
    delete data?.["USER_COMMENTS"];
    delete data?.["USER_TAGS"];
    delete data?.["USER_CAMPAIGNS"];
    delete data?.["SUBSCRIPTIONS"];
    delete data["@_ID"];
    delete data?.["SUBSCRIPTION_VARIABLES"];
    delete data?.["USER_DETAILS"];
    delete data?.["USER_PAYMENT_DETAILS"];
  }

  return { success: true, statusCode: response.status, data };
};

const myAffiliateResponseError = ({ error }) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let data = error.response.data;

    if (XMLValidator.validate(error.response.data)) {
      data = new XMLParser().parse(error.response.data);
      delete data["?xml"];
    }

    return {
      success: false,
      statusCode: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return { success: false, statusCode: null, data: null };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { success: false, statusCode: null, data: error.message };
  }
};

export const decodeMyAffiliateToken = async ({ TOKENS }) => {
  try {
    const response = await axios.post(
      config.get("myAffiliate.apiUrl"),
      {},
      {
        headers: getMyAffiliateAuthToken(),
        params: {
          FEED_ID: 4,
          TOKENS,
        },
      }
    );
    return myAffiliateResponseSuccess({ response, feed: 4 });
  } catch (error) {
    return myAffiliateResponseError({ error });
  }
};

export const getAffiliateDetails = async ({ USER_ID }) => {
  try {
    const response = await axios.post(
      config.get("myAffiliate.apiUrl"),
      {},
      {
        headers: getMyAffiliateAuthToken(),
        params: {
          FEED_ID: 1,
          USER_ID,
        },
      }
    );
    return myAffiliateResponseSuccess({ response, feed: 1 });
  } catch (error) {
    return myAffiliateResponseError({ error });
  }
};

export const createMyAffiliatePlayer = async ({
  TOKEN,
  DISPLAY_NAME,
  CLIENT_GROUP,
  CLIENT_REFERENCE,
  JOIN_DATE,
  COUNTRY,
}) => {
  try {
    const response = await axios.post(
      config.get("myAffiliate.apiUrl"),
      {},
      {
        headers: getMyAffiliateAuthToken(),
        params: {
          FEED_ID: 8,
          TOKEN,
          DISPLAY_NAME,
          CLIENT_GROUP,
          CLIENT_REFERENCE,
          JOIN_DATE,
          COUNTRY,
        },
      }
    );
    return myAffiliateResponseSuccess({ response });
  } catch (error) {
    return myAffiliateResponseError({ error });
  }
};
