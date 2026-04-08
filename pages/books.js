import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import useSWR from 'swr';
import { Pagination, Table } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

export default function Books() {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const queryString = useMemo(() => {
    const queryParams = { ...router.query };
    const qParts = [];

    Object.entries(queryParams).forEach(([key, value]) => {
      qParts.push(`${key}:${value}`);
    });

    return qParts.length > 0 ? qParts.join(' AND ') : '';
  }, [router.query]);

  const queryDescription = useMemo(() => {
    const parts = Object.entries(router.query).map(
      ([key, value]) => `${key}: ${value}`
    );

    return parts.length ? parts.join(' | ') : 'Enter a search to view matching books.';
  }, [router.query]);

  const { data, error, isLoading } = useSWR(
    queryString
      ? `https://openlibrary.org/search.json?q=${encodeURIComponent(queryString)}&page=${page}&limit=10`
      : null
  );

  useEffect(() => {
    setPage(1);
  }, [queryString]);

  if (error) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <PageHeader text="Search Results" subtext={queryDescription} />

      {isLoading ? null : (
        <>
          <Table striped hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>First Published</th>
              </tr>
            </thead>
            <tbody>
              {data?.docs?.length ? (
                data.docs.map((book) => (
                  <tr
                    key={book.key}
                    onClick={() => router.push(book.key)}
                  >
                    <td>{book.title || 'Untitled'}</td>
                    <td>{book.first_publish_year || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No results found for this search.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {data?.docs?.length ? (
            <Pagination>
              <Pagination.Prev onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page === 1} />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next onClick={() => setPage((current) => current + 1)} />
            </Pagination>
          ) : null}
        </>
      )}
    </>
  );
}
