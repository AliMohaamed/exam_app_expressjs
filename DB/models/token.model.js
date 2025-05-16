import mongoose, { model, Schema, Types } from "mongoose";

// Schema
const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    agent: {
      type: String,
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 0, // TTL based on date
    },
  },
  { timestamps: true }
);

// model
export const Token = mongoose.models.Token || model("Token", tokenSchema);
