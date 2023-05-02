import db from "../db/models";
import { Op } from "sequelize";
import { jwtVerifier } from "../cognito/cognito";

export async function isUserAuthenticated(req, res, next) {
  try {
    const token = getAccessToken(req);

    if (!token) {
      throw new Error("User must be authenticated");
    }

    const jwtData = await jwtVerifier.verify(token);
    const detail = await getUserDetail(jwtData.sub);

    req.body.user = detail;
    req.body.id = detail.userId;
    req.body.uniqueId = detail.uniqueId;

    if (detail.selfExclusion && new Date(detail.selfExclusion) >= new Date()) {
      return res
        .status(403)
        .json({ selfExclusion: true, expiration: detail.selfExclusion });
    }

    if (detail.userLimit.isSelfExclusionPermanent) {
      return res
        .status(403)
        .json({ selfExclusion: true, expiration: "permanent" });
    }

    return next();
  } catch (err) {
    res.status(403).json({
      message: err.message,
    });
  }
}

const getAccessToken = function (req) {
  if (
    req &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const getUserDetail = async (userId) => {
  const detail = await db.User.findOne({
    where: { [Op.or]: { userId: userId } },
    attributes: [
      "userId",
      "email",
      "signInCount",
      "username",
      "signInIp",
      "isActive",
      "lastLoginDate",
      "kycStatus",
      "password",
      "isEmailVerified",
      "loggedIn",
      "selfExclusion",
      "locale",
      "uniqueId",
    ],
    include: [
      {
        model: db.Limit,
        as: "userLimit",
        attributes: ["selfExclusion", "isSelfExclusionPermanent", "timeLimit"],
      },
    ],
  });

  const takeABreakTimeStamp = detail.dataValues.selfExclusion;

  // TODO: user limit entity not created when creating user
  const selfExclusionTimeStamp = detail.userLimit?.selfExclusion || false;
  const isSelfExclusionPermanent = detail.userLimit?.selfExclusion || false;
  const sessionTime = detail.userLimit?.timeLimit || 0;

  delete detail.dataValues.userLimit;

  const userObj = detail.get({ plain: true });
  userObj.sessionTime = sessionTime;

  userObj.userLimit = userObj.userLimit || {
    selfExclusion: false,
    isSelfExclusionPermanent: false,
    timeLimit: null,
  };

  if (takeABreakTimeStamp && new Date(takeABreakTimeStamp) >= new Date()) {
    userObj.selfExclusion = true;
    userObj.expiration = takeABreakTimeStamp;
  } else if (
    selfExclusionTimeStamp &&
    new Date(selfExclusionTimeStamp) >= new Date()
  ) {
    userObj.selfExclusion = true;
    userObj.expiration = selfExclusionTimeStamp;
  } else if (isSelfExclusionPermanent) {
    userObj.selfExclusion = true;
    userObj.expiration = "permanent";
  } else {
    userObj.selfExclusion = false;
    userObj.expiration = null;
  }

  return userObj;
};
