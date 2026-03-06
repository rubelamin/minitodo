import bcrypt from "bcryptjs";

export const hashPassword = async (password: string, inputSalt = undefined) => {
  const salt = inputSalt ? inputSalt : await bcrypt.genSalt(10);

  const passwordHashed = await bcrypt.hash(password, salt);

  return { passwordHashed, salt };
};

export const comparePassword = async (
  password: string,
  userDbPassword: string,
) => {
  const matched = await bcrypt.compare(password, userDbPassword);

  return matched;
};
