import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import { favouritesAtom } from '@/store';
import { authenticateUser } from '@/lib/authenticate';
import { getFavourites } from '@/lib/userData';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const router = useRouter();

  async function updateAtom() {
    setFavouritesList(await getFavourites());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await authenticateUser(user, password);
      await updateAtom();
      router.push('/');
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <PageHeader text="Login" subtext="Log in to your account:" />
      {warning ? <Alert variant="danger">{warning}</Alert> : null}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" value={user} onChange={(event) => setUser(event.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
