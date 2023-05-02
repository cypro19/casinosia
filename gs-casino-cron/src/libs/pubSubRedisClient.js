import Redis from "ioredis";
import config from "../configs/app.config";

const connection = {
  host: config.get("pub_sub_redis_db.host"),
  port: config.get("pub_sub_redis_db.port"),
  password: config.get("pub_sub_redis_db.password"),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export default {
  connection,
  publisherClient: new Redis(connection),
  subscriberClient: new Redis(connection),
  client: new Redis(connection),
};
