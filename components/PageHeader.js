import { Card } from 'react-bootstrap';

export default function PageHeader({ text, subtext }) {
  return (
    <>
      <Card className="bg-light">
        <Card.Body>
          {text}
          {subtext ? (
            <>
              <br />
              {subtext}
            </>
          ) : null}
        </Card.Body>
      </Card>
      <br />
    </>
  );
}
