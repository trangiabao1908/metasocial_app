import mongoose, { Schema, Document } from "mongoose";

// Định nghĩa interface cho dữ liệu token
interface IToken extends Document {
  email: string;
  token: string;
}

// Định nghĩa schema cho collection
const TokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

const TokenModel = mongoose.model<IToken>("Token", TokenSchema);

export default TokenModel;
