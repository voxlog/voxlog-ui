import { useAuth } from '../../hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { validatePassword } from '../../utils/validators/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { SignUpForm, submitForm, validateFormData } from './helpers';

export default function SingUp() {
  const router = useRouter();
  const { user, signIn, loading } = useAuth();
  if (user?.username) router.push('/');

  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [realName, setRealName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const formData: SignUpForm = {
    username,
    email,
    birthDate,
    bio,
    realName,
    password,
    passwordConfirmation,
  };

  const buttonDisabled = !validateFormData(formData);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await submitForm(formData);
      await signIn(username, password);
    } catch (error: unknown) {
      const response = error as Response;
      console.log(response);
      if (response.status === 400) setError('Dados inválidos');
      else setError('Erro desconhecido');
    }
  }

  if (error)
    return (
      // center error message
      <div className="flex items-center justify-center w-full h-screen bg-center bg-cover bg-opacity-30 bg-drums-bg">
        <div className="absolute w-full h-full bg-black opacity-70 " />
        <div className="z-10 w-full max-w-sm mx-auto rounded-xl ">
          <div className="px-10 py-4 bg-white rounded-xl dark:bg-neutral-900">
            <h1 className="mb-5 text-lg font-bold text-black dark:text-white">Error</h1>
            <p className="mb-2 text-center text-red-500">{error}</p>
            <Link href="/signin">
              <span className="block mt-5 text-sm font-bold text-center text-blue-500 dark:text-blue-400 hover:underline">
                Go back to sign in
              </span>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-center bg-cover bg-opacity-30 bg-drums-bg">
      <div className="absolute w-full h-full bg-black opacity-70 " />
      <div className="z-10 w-full max-w-sm mx-auto rounded-xl ">
        <form className="px-10 py-4 bg-white rounded-xl dark:bg-neutral-900" onSubmit={handleSubmit}>
          <h1 className="mb-5 text-lg font-bold text-black dark:text-white">Create account</h1>
          <Input
            label="Username*"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="your username"
            maxLength={16}
            minLength={3}
            required
          />
          <Input
            label="E-mail*"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="your e-mail"
            maxLength={100}
            minLength={3}
            required
          />
          <Input
            label="Password*"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="a safe password"
            maxLength={100}
            minLength={8}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The password must contain only letters and numbers. At least 8 characters, at least 1 letter and 1 number.
          </p>

          <Input
            label="Confirm password*"
            type="password"
            value={passwordConfirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
            placeholder="confirm your password"
            maxLength={100}
            minLength={8}
            required
          />

          <Input
            label="Birth date*"
            type="date"
            value={birthDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}
            placeholder="your birth date"
            maxLength={10}
            minLength={10}
            required
          />
          <Input
            label="Real name"
            type="text"
            value={realName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRealName(e.target.value)}
            placeholder="your real name"
            maxLength={100}
            minLength={3}
            required={false}
          />
          <Input
            label="Bio"
            type="text"
            value={bio}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}
            placeholder="a little bit about you"
            maxLength={100}
            minLength={3}
            required={false}
          />
          <div className="flex items-center justify-between">
            <button
              disabled={loading || buttonDisabled}
              className="px-4 py-2 mx-auto font-bold text-white duration-300 bg-purple-500 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 hover:scale-110"
              type="submit">
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-2 mb-5 text-base text-center text-white">
          Already have an account?{' '}
          <Link className="text-purple-500 hover:text-purple-700 dark:hover:text-purple-400" href="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  maxLength: number;
  minLength: number;
  required: boolean;
};

const Input = ({ label, type, value, onChange, placeholder, maxLength, minLength, required }: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-bold text-neutral-700 dark:text-neutral-200" htmlFor={label}>
        {label}
      </label>
      <input
        className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-neutral-800"
        id={label}
        type={type}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
