import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/auth';
import UserImage from '../userImage';
import Image from 'next/image';

const navbarLinks: LinkProps[] = [
  {
    text: 'tracks',
    href: '/tracks',
  },
  {
    text: 'albums',
    href: '/albums',
  },
  {
    text: 'artists',
    href: '/artists',
  },
  {
    text: 'events',
    href: '/events',
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <nav className="top-0 left-0 z-50 w-full py-1 bg-white shadow-sm dark:bg-black">
      <div className="container max-w-4xl mx-auto">
        <div className="relative flex items-center justify-between h-20">
          <div className="flex items-center flex-1 sm:items-stretch sm:justify-between">
            <Link href="/" className="mx-auto md:m-0 ">
              <div className="py-0 ">
                <Image src="/images/logo-black.svg" width={100} height={100} alt="logo" className="block dark:hidden" />
                <Image src="/images/logo-white.svg" width={100} height={100} alt="logo" className="hidden dark:block" />
              </div>
            </Link>
            <NavLinksDesktop />
          </div>
          <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <NavLinksMobile isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </nav>
  );
};

const ToggleButton = ({ isOpen, setIsOpen }: any) => {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 mt-1 rounded-md hover:text-white hover:bg-purple-500 "
        aria-controls="mobile-menu"
        aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg
          className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Navbar;

type LinkProps = {
  href: string;
  text: string;
};

const NavLinksDesktop = () => {
  const { user } = useAuth();
  return (
    <div className="items-center justify-end hidden sm:flex">
      <div className="flex items-center space-x-4">
        {navbarLinks.map((link) => (
          <Link href={link.href} className="duration-200 hover:scale-105" key={link.href}>
            <span className="text-lg font-light text-black dark:text-white hover:underline underline-offset-2 decoration-1 ">
              {link.text}
            </span>
          </Link>
        ))}
        {user ? (
          <Link href={`/users/${user.username}`}>
            <div className="flex items-center space-x-2">
              <UserImage url={user.profilePictureUrl} sizeInPixels={40} name={user.username} className="rounded-full" />
              <span className="text-lg font-medium text-black dark:text-white hover:underline underline-offset-2 decoration-1 ">
                {user.username}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/signin" className="duration-200 hover:scale-110">
            <span className="px-6 py-2 text-lg font-medium text-white bg-purple-400 rounded-3xl underline-offset-2 decoration-1 ">
              Sign In
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

const NavLinksMobile = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (bool: boolean) => void }) => {
  const { user } = useAuth();
  return (
    <div className="px-2 pt-2 pb-3 space-y-1">
      <Link href="/" onClick={() => setIsOpen(!isOpen)}>
        <span className="block px-3 py-2 mt-1 text-base font-medium bg-neutral-200 dark:text-white dark:bg-neutral-700 rounded-3xl focus:outline-none focus:text-white focus:bg-purple-500 hover:bg-purple-500 hover:text-white">
          home
        </span>
      </Link>
      {navbarLinks.map((link) => (
        <Link href={link.href} onClick={() => setIsOpen(!isOpen)} key={link.href}>
          <span className="block px-3 py-2 mt-1 text-base font-medium bg-neutral-50 dark:text-white dark:bg-neutral-800 rounded-3xl focus:outline-none focus:text-white focus:bg-purple-500 hover:bg-purple-500 hover:text-white">
            {link.text}
          </span>
        </Link>
      ))}
      {user ? (
        <Link href={`/users/${user.username}`} onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center justify-center mt-1 space-x-1">
            <span className="flex items-center justify-between w-full pl-3 text-base font-medium bg-neutral-50 dark:text-white dark:bg-neutral-800 rounded-3xl focus:outline-none focus:text-white focus:bg-purple-500 hover:bg-purple-500 hover:text-white">
              {user.username}
              <UserImage url={user.profilePictureUrl} sizeInPixels={40} name={user.username} className="rounded-full" />
            </span>
          </div>
        </Link>
      ) : (
        <Link href="/signin">
          <span className="block px-3 py-2 mt-1 text-base font-medium text-white bg-purple-500 dark:bg-neutral-800 rounded-3xl focus:outline-none focus:text-white focus:bg-purple-800 hover:bg-purple-800 hover:text-white">
            Sign In
          </span>
        </Link>
      )}
    </div>
  );
};

type ItemProps = {
  name: string;
  href: string;
};

const Item = ({ name, href }: ItemProps) => {
  return (
    <Link href={href}>
      <span className="px-4 text-xl font-semibold">{name}</span>
    </Link>
  );
};

const Account = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex">
      <Link href={user?.username ? `/users/${user?.username}` : '/signin'}>
        <div className="flex items-center justify-center mt-2 md:mt-0">
          {user?.profilePictureUrl && (
            <UserImage url={user?.profilePictureUrl} name={user?.username} sizeInPixels={32} />
          )}
          <h1 className="ml-2 font-bold text-md">{user?.realName?.split(' ')[0] || user?.username || 'sign in'}</h1>
        </div>
      </Link>
      <button className="ml-2 text-sm font-bold text-white font-nerd" onClick={() => logout()}>
        {user?.username ? ' logout' : ''}
      </button>
    </div>
  );
};
