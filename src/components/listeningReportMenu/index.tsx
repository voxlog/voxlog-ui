import React from "react";
import Link from "next/link";

const ListeningReportMenu = () => {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold">Listening Report</h2>
      <ul className="items-center justify-center">
        <li className="items-center justify-center w-full">
          <Link href="/last-day">
            <span className="text-lg">Last Day</span>
          </Link>
        </li>
        <li className="items-center justify-center w-full">
          <Link href="/last-week">
            <span className="text-lg">Last Week</span>
          </Link>
        </li>
        <li className="items-center justify-center w-full">
          <Link href="/last-month">
            <span className="text-lg">Last Month</span>
          </Link>
        </li>
        <li className="items-center justify-center w-full">
          <Link href="/last-year">
            <span className="text-lg">Last Year</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default ListeningReportMenu;
