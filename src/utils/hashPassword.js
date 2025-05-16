import bcryptjs from "bcryptjs";

export const createHashedPassword = async (password) => {
  const salt = await bcryptjs.genSalt(process.env.SLAT);
  return await bcryptjs.hash(password, salt);
};

export const checkPassword = (plainPassword, hashedPassword) => {
  return bcryptjs.compareSync(plainPassword, hashedPassword);
};
