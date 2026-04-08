/*********************************************************************************
* BTI425 - Assignment 3
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Festus Sabu Student ID: 164954232 Date: 2026-04-07
*
* Vercel App (Deployed) Link:
*
*********************************************************************************/
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = (data) => {
    router.push({
      pathname: '/books',
      query: Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== '')
      ),
    });
  };

  return (
    <>
      <PageHeader
        text="Search"
        subtext="Search for books using author, title, subject, language, and first publish year."
      />

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Douglas Adams"
                    className={errors.author ? 'is-invalid' : ''}
                    {...register('author', { required: 'Author is required.' })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.author?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="The Hitchhiker's Guide" {...register('title')} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" placeholder="Science Fiction" {...register('subject')} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="language">
                  <Form.Label>Language</Form.Label>
                  <Form.Control type="text" placeholder="eng" {...register('language')} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="first_publish_year">
                  <Form.Label>First Publish Year</Form.Label>
                  <Form.Control type="text" placeholder="1979" {...register('first_publish_year')} />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className="mt-3">
              Search Books
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
