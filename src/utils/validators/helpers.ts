export const validatePassword = (password: string): boolean => {
  const regex: RegExp =
  /^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/;
  return regex.test(password);
};
