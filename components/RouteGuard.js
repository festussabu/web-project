import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { getFavourites } from '@/lib/userData';
import { readToken } from '@/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/register', '/about'];

export default function RouteGuard(props) {
  const [authorized, setAuthorized] = useState(false);
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const router = useRouter();

  useEffect(() => {
    const authCheck = async (url) => {
      async function updateAtom() {
        if (readToken()) {
          setFavouritesList(await getFavourites());
        } else {
          setFavouritesList(undefined);
        }
      }

      await updateAtom();

      const path = url.split('?')[0];

      if (!readToken() && !PUBLIC_PATHS.includes(path)) {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    };

    authCheck(router.asPath);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [router, setFavouritesList]);

  return authorized ? props.children : null;
}
