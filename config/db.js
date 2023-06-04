import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const databaseName = process.env.DBNAME;
// badel hedhi ki bech taamel docker-compose up DOCKERDBURL
const databaseURL = process.env.DBURL;
mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const connectDb = () => {
  mongoose
    .connect(`mongodb://${databaseURL}/${databaseName}`)
    .then(() => {
      console.log(`Connected to database`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDb;
