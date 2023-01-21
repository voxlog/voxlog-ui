import { validatePassword } from '../../utils/validators/helpers';
import api from '../../lib/axios';

export type SignUpForm = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  bio: string;
  realName: string;
  birthDate: string;
};

export const validateFormData = (form: SignUpForm): boolean => {
  const { username, email, password, birthDate, passwordConfirmation } = form;

  if (!username || !email || !password || !birthDate) return false;

  if (!validatePassword(password)) return false;

  if (password !== passwordConfirmation) return false;

  return true;
};
type UserCreateSchema = {
  username: string;
  password: string;
  email: string;
  birthDate: string;
  bio: string;
  realName: string;
};

export async function submitForm(form: SignUpForm): Promise<void> {
  const user: UserCreateSchema = {
    username: form.username,
    password: form.password,
    email: form.email,
    birthDate: form.birthDate,
    bio: form.bio,
    realName: form.realName,
  };
  try {
    const response = await api.post('/users', user);
  } catch (error) {
    throw error;
  }
}
