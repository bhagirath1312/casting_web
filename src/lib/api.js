const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchCastings() {
  const res = await fetch(`${BASE_URL}/api/casting-status`, {
    cache: 'no-store'
  });
  return res.json();
}