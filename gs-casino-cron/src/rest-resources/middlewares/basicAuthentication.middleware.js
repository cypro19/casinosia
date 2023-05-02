import basicAuth from "express-basic-auth";
import config from "../../configs/app.config";

const basicAuthenticationMiddleware = basicAuth({
  users: {
    [config.get("basic_auth.username")]: config.get("basic_auth.password"),
  },
  challenge: true,
});

export default basicAuthenticationMiddleware;
