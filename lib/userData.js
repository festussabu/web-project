import { getToken } from '@/lib/authenticate';

async function fetchUserData(route, method = 'GET') {
  try {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
      method,
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res.json();
    }
  } catch {
    return [];
  }

  return [];
}

export async function addToFavourites(id) {
  return fetchUserData(`/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return fetchUserData(`/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return fetchUserData('/favourites');
}
