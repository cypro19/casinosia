import passport from "passport";
import { ROLE } from "../utils/constant";
import { APP_ERROR_CODES } from "../utils/errors";

export function isAdminAuthenticated(req, res, next) {
  passport.authenticate("jwt", (err, data) => {
    if (err) {
      if (err.message === APP_ERROR_CODES.ADMIN_NOT_FOUND) {
        return res.status(400).json(err);
      }
      return res.status(403).json({ message: err });
    }
    req.login(data, (loginErr) => {
      if (loginErr) {
        return res.status(403).send(loginErr);
      }

      if (data.userType !== ROLE.ADMIN) {
        return res.status(403).send(APP_ERROR_CODES.ADMIN_NOT_FOUND);
      }
      if (!data.detail.isActive) return res.status(403).send("Client Inactive");

      req.body.user = data.detail;
      req.body.id = data.detail.adminUserId;
      req.body.userType = data.userType;

      next();
    });
  })(req, res, next);
}
