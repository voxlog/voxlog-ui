import { useAuth } from '../../hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { validatePassword } from '../../utils/validators/helpers';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const { user, signIn, loading, signInError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user?.username) router.push('/');
  }, [user, router]);

  const buttonDisabled = password.length < 3 || username.length < 3 || !validatePassword(password);
  const errorMessage = signInError ? 'Invalid username or password' : '';
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-center bg-cover bg-opacity-30 bg-drums-bg">
      <div className="absolute w-full h-full bg-black opacity-70" />
      <div className="z-10 w-full max-w-xs mx-auto">
        <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md dark:bg-neutral-900" onSubmit={handleSubmit}>
          <h1 className="mb-5 text-lg font-bold text-black dark:text-white">Welcome back to Voxlog!</h1>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-neutral-700 dark:text-neutral-200" htmlFor="username">
              your username
            </label>
            <input
              className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-neutral-800"
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-neutral-700 dark:text-neutral-200" htmlFor="password">
              your password
            </label>
            <input
              className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-neutral-800"
              id="password"
              type="password"
              placeholder="your strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* message in case of failure */}
          <p className="text-sm text-red-500">{loading && 'Loading...'}</p>
          <p className="mb-5 text-sm text-center text-red-500">{errorMessage}</p>
          <div className="flex items-center justify-between">
            <button
              disabled={loading || buttonDisabled}
              className="px-4 py-2 mx-auto font-bold text-white duration-300 bg-purple-500 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 hover:scale-110"
              type="submit">
              Sign In
            </button>
          </div>
        </form>

        <p className="text-base text-center text-white">
          Don't have an account?{' '}
          <Link className="text-purple-500 hover:text-purple-700 dark:hover:text-purple-400" href="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
