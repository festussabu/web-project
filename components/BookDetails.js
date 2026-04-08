import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function BookDetails({ book, workId, showFavouriteBtn = true }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(workId ? favouritesList?.includes(workId) : false);
  }, [favouritesList, workId]);

  const favouritesClicked = async () => {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(workId));
    } else {
      setFavouritesList(await addToFavourites(workId));
    }
  };

  return (
    <Container>
      <Row>
        <Col lg="4">
          <img
            onError={(event) => {
              event.target.onerror = null;
              event.target.src =
                'https://placehold.co/400x600?text=Cover+Not+Available';
            }}
            className="img-fluid w-100"
            src={`https://covers.openlibrary.org/b/id/${book?.covers?.[0]}-L.jpg`}
            alt="Cover Image"
          />
          <br />
          <br />
        </Col>

        <Col lg="8">
          <h3>{book?.title || 'Untitled'}</h3>

          {book?.description ? (
            <p>
              {typeof book.description === 'string'
                ? book.description
                : book.description.value}
            </p>
          ) : (
            <p>No description available.</p>
          )}

          {book?.subject_people?.length ? (
            <>
              <h5>Characters</h5>
              <p>{book.subject_people.join(', ')}</p>
            </>
          ) : null}

          {book?.subject_places?.length ? (
            <>
              <h5>Settings</h5>
              <p>{book.subject_places.join(', ')}</p>
            </>
          ) : null}

          {book?.links?.length ? (
            <>
              <h5>More Information</h5>
              {book.links.map((link, index) => (
                <span key={index}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.title}
                  </a>
                  <br />
                </span>
              ))}
            </>
          ) : null}

          {showFavouriteBtn ? (
            <Button
              variant={showAdded ? 'primary' : 'outline-primary'}
              className="mt-3"
              onClick={favouritesClicked}
            >
              {showAdded ? '+ Favourite (added)' : '+ Favourite'}
            </Button>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
}
