import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/auth';

const ListeningReportMenu = () => {
  const { user } = useAuth();
  if (!user) return <></>;
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold">Listening Report</h2>
      <ul className="items-center justify-center">
        <li className="items-center justify-center w-full">
          <Link href={`/users/${user.username}/last-day`}>
            <span className="text-lg">Last Day</span>
          </Link>
        </li>
        <li className="items-center justify-center w-full">
          <Link href={`/users/${user.username}/last-week`}>
            <span className="text-lg">Last Week</span>
          </Link>
        </li>
        <li className="items-center justify-center w-full">
          <Link href={`/users/${user.username}/last-month`}>
            <span className="text-lg">Last Month</span>
          </Link>
        </li>
        <li className="items-center justify-center w-full">
          <Link href={`/users/${user.username}/last-year`}>
            <span className="text-lg">Last Year</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default ListeningReportMenu;
