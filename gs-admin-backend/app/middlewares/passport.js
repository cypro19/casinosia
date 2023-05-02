import db from "../db/models";
import config from "../../config/app";
import { ROLE } from "../utils/constant";
import { getOne } from "../services/helper/crud";
import { APP_ERROR_CODES } from "../utils/errors";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword, signAccessToken } from "../utils/common";

function initPassport(passport) {
  const opts = {};
  opts.jwtFromRequest = getAccessToken;
  opts.secretOrKey = config.get("jwt.loginTokenSecret");

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const url = req.originalUrl;
        let detail;
        email = email.toLowerCase();

        if (url === "/api/admin/login") {
          detail = await db.SuperAdminUser.findOne({
            where: { email },
            include: [
              { model: db.SuperadminRole },
              { model: db.SuperAdminUserPermission, as: "userPermission" },
            ],
          });
        }
        if (detail == null) {
          return done(
            {
              message: APP_ERROR_CODES.EMAIL_NOT_REGISTERED,
              code: "EMAIL_NOT_REGISTERED",
            },
            null
          );
        }

        if (!(await comparePassword(password, detail.password))) {
          return done(
            {
              message: APP_ERROR_CODES.INCORRECT_PASSWORD,
              code: "INCORRECT_PASSWORD",
            },
            null
          );
        }

        let id, role;

        if (url === "/api/admin/login") {
          id = detail.superAdminUserId;
          role = ROLE.SUPERADMIN;
        }

        const userObj = detail.get({ plain: true });
        const jwtToken = await signAccessToken({
          id: id,
          email: detail.email,
          name: detail.firstName + " " + detail.lastName,
          role: role,
        });

        userObj.accessToken = jwtToken;
        return done(null, userObj);
      }
    )
  );

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      let detail;
      if (jwt_payload.email) {
        if (jwt_payload.role === ROLE.SUPERADMIN) {
          detail = await getOne({
            model: db.SuperAdminUser,
            data: { email: jwt_payload.email },
          });
        }

        if (detail) {
          return done(null, { detail, userType: jwt_payload.role });
        } else {
          return done({ message: APP_ERROR_CODES.SUPERADMIN_NOT_FOUND });
        }
      }
      return done({ message: APP_ERROR_CODES.INVALID_TOKEN });
    })
  );

  passport.serializeUser((detail, done) => {
    done(null, detail);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
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

module.exports = initPassport;
