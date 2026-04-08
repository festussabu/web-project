import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(readToken());
  }, [router.asPath]);

  function logout() {
    removeToken();
    setToken(null);
    router.push('/login');
  }

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Student Name
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} href="/about">
            About
          </Nav.Link>
        </Nav>

        {token ? (
          <Nav>
            <NavDropdown title={token.userName} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} href="/favourites">
                Favourites
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : null}

        {!token ? (
          <Nav>
            <Nav.Link as={Link} href="/register">
              Register
            </Nav.Link>
          </Nav>
        ) : null}
      </Container>
    </Navbar>
  );
}
