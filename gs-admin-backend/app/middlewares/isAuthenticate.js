import passport from "passport";
import { ROLE } from "../utils/constant";
import { APP_ERROR_CODES } from "../utils/errors";

export function isAuthenticate(req, res, next) {
  passport.authenticate("jwt", (err, data) => {
    if (err) {
      if (err.message === APP_ERROR_CODES.SUPERADMIN_NOT_FOUND) {
        return res.status(400).json(err);
      }
      return res.status(403).json({ message: err });
    }
    req.login(data, (loginErr) => {
      if (loginErr) {
        return res.status(403).send(loginErr);
      }

      if (data.userType !== ROLE.SUPERADMIN && data.detail.superRoleId !== 1) {
        return res.status(403).send(APP_ERROR_CODES.SUPERADMIN_NOT_FOUND);
      }

      if (!data.detail.isActive)
        return res.status(403).send("Superadmin Inactive");

      req.body.user = data.detail;
      req.body.id = data.detail.superAdminUserId;
      req.body.userType = data.userType;

      next();
    });
  })(req, res, next);
}
