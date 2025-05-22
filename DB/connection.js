import mongoose from "mongoose";

export const connectionDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTIONURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log("DB Connected....!"))
    .catch((error) => {
      console.log("Error", error);
      // Optional: إعادة المحاولة بعد 5 ثواني
      setTimeout(connectionDB, 5000);
    });
};
