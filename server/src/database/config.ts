import mongoose from "mongoose";
import dotenv from "dotenv";
import { ConnectOptions } from "mongoose";
dotenv.config();
const URL_DB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gedwpyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const URL_DB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gedwpyr.mongodb.net/?retryWrites=true&w=majority`;
const configMongoose = async () => {
  try {
    console.log(URL_DB);

    mongoose.set("strictQuery", false);
    mongoose.connect(URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
export default configMongoose;
