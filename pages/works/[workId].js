import { useRouter } from 'next/router';
import Error from 'next/error';
import useSWR from 'swr';
import BookDetails from '@/components/BookDetails';
import PageHeader from '@/components/PageHeader';

export default function Work() {
  const router = useRouter();
  const { workId } = router.query;
  const { data, error, isLoading } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null
  );

  if (isLoading || !workId) {
    return null;
  }

  if (error || !data) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <PageHeader text={data.title} subtext={`Work ID: ${workId}`} />
      <BookDetails book={data} workId={workId} />
    </>
  );
}
