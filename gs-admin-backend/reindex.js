import _ from "./config/app";
import { resetIndexes } from "./app/services/helper/resetElastic";
import { reindexData } from "./app/services/helper/elastic";

(async () => {
  // console.log(appConfig);
  await resetIndexes();
  await reindexData();
})();
