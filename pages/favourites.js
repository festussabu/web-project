import { useAtom } from 'jotai';
import { Col, Row } from 'react-bootstrap';
import BookCard from '@/components/BookCard';
import PageHeader from '@/components/PageHeader';
import { favouritesAtom } from '@/store';

export default function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom);

  if (!favouritesList) {
    return null;
  }

  if (!favouritesList.length) {
    return (
      <PageHeader
        text="Nothing Here"
        subtext="Add a book to your favourites list to see it on this page."
      />
    );
  }

  return (
    <>
      <PageHeader text="Favourites" subtext="Your favourite books" />
      <Row>
        {favouritesList.map((workId) => (
          <Col lg={3} md={6} key={workId}>
            <BookCard workId={workId} />
          </Col>
        ))}
      </Row>
    </>
  );
}
