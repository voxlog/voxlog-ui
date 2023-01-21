import React from "react";
import Link from "next/link";

const RecentEventsMenu = () => {
  const events = [
    [
      "Banda Marília Gabriela",
      "New York, NY",
      "Mar 25",
      "https://ingresso.com",
    ],
    ["Detonautas", "Pres. Prudente, SP", "may 30", "https://ingresso.com"],
    ["Raça Negra", "São Paulo, SP", "aug 06", "https://ingresso.com"],
  ];
  let counter = 0;
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold">Recent Events</h2>
      <ul className="items-center justify-center">
        {events.map(([artist, location, date, href]) => (
          <EventCard
            key={counter++}
            artist={artist}
            location={location}
            date={date}
            href={href}
          />
        ))}
      </ul>
    </section>
  );
};

type EventCardProps = {
  artist: string;
  location: string;
  date: string;
  href: string;
};

const EventCard = ({ artist, location, date, href }: EventCardProps) => {
  return (
    <li className="w-full">
      <Link href={href}>
        <span className="items-center justify-center w-full text-lg border-b-2 border-neutral-100 dark:border-neutral-800">
          <h1 className="font">{artist}</h1>
          <span className="text-sm font-extralight">
            {date} - {location}
          </span>
        </span>
      </Link>
    </li>
  );
};

export default RecentEventsMenu;
