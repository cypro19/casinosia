import Jwt from "jsonwebtoken";
import { APP_ERROR_CODES } from "../utils/errors";
import { ROLE } from "../utils/constant";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  const tokenData = Jwt.verify(token, process.env.SECRET_KEY);

  if (!tokenData)
    return res.status(400).json({ message: APP_ERROR_CODES.INVALID_TOKEN });

  if (
    (tokenData.id !== 1 || tokenData.id !== 2) &&
    tokenData.role !== ROLE.SUPERADMIN
  ) {
    return res
      .status(403)
      .json({ message: APP_ERROR_CODES.SUPERADMIN_NOT_FOUND });
  }

  req.body.adminDetails = tokenData;

  next();
};
