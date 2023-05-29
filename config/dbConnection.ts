import mongoose from "mongoose";
import config from "./config";
import { info, error, debug } from "./logger";

class dbConnection {
  connection: Object = {};
  constructor() {
    this.connection = mongoose
      .connect(config.dbConnection, {})
      .then((data) => {
        info(`Db Connected`);
        return true;
      })
      .catch((err) => {
        error(`Db Connection Error : ${err}`);
        return false;
      });
  }

  dbConnectionOpen() {
    mongoose.connect(config.dbConnection);
  }

  dbConnectionClose() {
    mongoose.connection.close();
  }
}

export default new dbConnection();
