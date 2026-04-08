import Link from 'next/link';
import Error from 'next/error';
import useSWR from 'swr';
import { Button, Card } from 'react-bootstrap';

export default function BookCard({ workId }) {
  const { data, error, isLoading } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null
  );

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return <Error statusCode={404} />;
  }

  return (
    <Card>
      <Card.Img
        variant="top"
        onError={(event) => {
          event.target.onerror = null;
          event.target.src = 'https://placehold.co/400x600?text=Cover+Not+Available';
        }}
        className="img-fluid w-100"
        src={`https://covers.openlibrary.org/b/id/${data?.covers?.[0]}-M.jpg`}
        alt="Cover Image"
      />
      <Card.Body>
        <Card.Title>{data.title || ''}</Card.Title>
        <Card.Text>{data.first_publish_date || data.first_published_date || 'N/A'}</Card.Text>
        <Button as={Link} href={`/works/${workId}`}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}
