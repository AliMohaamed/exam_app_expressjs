import mongoose, { Schema, model } from "mongoose";

const examSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual populate
examSchema.virtual("questions", {
  ref: "Question",
  foreignField: "exam",
  localField: "_id",
});

export const Exam = mongoose.models.Exam || model("Exam", examSchema);
