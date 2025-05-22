import { Schema } from "mongoose";




// const examSchema = new Schema({
//   examName: {
//     type: String,
//     required: true,
//     },
//     examDate: {
//     type: Date,
//     required: true,
//     },
//     examDuration: {
//     type: Number,
//     required: true,
//     },
//     examType: {
//     type: String,
//     enum: ["MCQ", "Descriptive"],
//     required: true,
//     },
//     examMarks: {
//     type: Number,
//     required: true,
//     },
//     examTotalMarks: {
//     type: Number,
//     required: true,
//     },
//     examSubject: {
//     type: String,
//     required: true,
//     },
//     examClass: {
//     type: String,
//     required: true,
//     },
//     examStatus: {
//     type: String,
//     enum: ["Scheduled", "Completed", "Cancelled"],
//     required: true,
//     },
//     examCreatedBy: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     },
//     examCreatedAt: {
//     type: Date,
//     default: Date.now,
//     },
// });