import Navbar from '../components/navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="absolute top-0 w-full h-screen overflow-hidden -z-10">
      <Image
        src="/images/instruments/guitar_2.png"
        alt="guitar_2"
        {...{
          fill: true,
          style: {
            objectFit: 'cover',
            objectPosition: '50% 80%',
          },
        }}
        className="blur-sm"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60" />

      <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-5xl font-bold text-white">Voxlog</h1>
        <p className="text-2xl text-center text-white">Your one stop service for all your musical styles.</p>
        <Link href="/signin">
          <button className="px-4 py-2 mt-4 text-lg font-bold text-white bg-purple-500 rounded-md">Get Started</button>
        </Link>
      </div>
    </div>
  );
}
