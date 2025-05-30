import mongoose, { Schema, Types, model } from "mongoose";
import { createHashedPassword } from "../../src/utils/hashPassword.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: function () {
        return this.role === "student";
      },
    },
    phone: String,
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "admin"],
      default: "student",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires: Date,
    activationCode: String,
    profileImage: {
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/dlqnb0j16/image/upload/v1746994395/user_pwsozt.png",
      },
      public_id: {
        type: String,
        default: "user_pwsozt",
      },
    },
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await createHashedPassword(this.password);
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.models.User || model("User", userSchema);
