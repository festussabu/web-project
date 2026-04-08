import BookDetails from '@/components/BookDetails';
import PageHeader from '@/components/PageHeader';

export async function getStaticProps() {
  const response = await fetch('https://openlibrary.org/works/OL453657W.json');
  const book = await response.json();

  return {
    props: { book },
  };
}

export default function About({ book }) {
  return (
    <>
      <PageHeader
        text="About the Developer"
        subtext="Festus Sabu - building responsive web apps and exploring great books along the way."
      />
      <p>
        I enjoy building full-stack web applications and experimenting with interfaces that are
        clean, useful, and easy to navigate.
      </p>
      <p>
        One of my favourite books to revisit is this one because it balances humour, imagination,
        and memorable characters.
      </p>
      <BookDetails book={book} workId="OL453657W" showFavouriteBtn={false} />
    </>
  );
}
