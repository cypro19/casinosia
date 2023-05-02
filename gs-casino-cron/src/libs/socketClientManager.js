import { Manager } from "socket.io-client";
import config from "../configs/app.config";
import { SOCKET_NAMESPACES } from "../libs/constants";

const userBackendClientManager = new Manager(config.get("user_backend.ws_url"));

const userBackendInternalCrashGameClient = userBackendClientManager.socket(
  SOCKET_NAMESPACES.INTERNAL_CRASH_GAME,
  {
    auth: {
      basicToken:
        "Basic " +
        Buffer.from(
          `${config.get("user_backend.basic_auth.username")}:${config.get(
            "user_backend.basic_auth.password"
          )}`
        ).toString("base64"),
    },
  }
);

export default {
  userBackendInternalCrashGameClient,
};
