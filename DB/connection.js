import mongoose from "mongoose";

export const connectionDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTIONURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 ثواني مهلة للاتصال
    })
    .then(() => console.log("DB Connected....!"))
    .catch((error) => console.log("Error", error));
};
