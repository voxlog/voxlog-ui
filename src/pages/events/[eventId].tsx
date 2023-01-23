import { NextPageContext } from 'next';

export default function Event({ eventId }: { eventId: string }) {
  return (
    <div>
      <h1>Event: {eventId}</h1>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { eventId } = context.query;
  return {
    props: {
      eventId,
    },
  };
}
