import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://casting-web.onrender.com';

export default async function AdminCastingDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  const res = await fetch(`${BASE_URL}/api/casting-status`, {
    cache: 'no-store',
  });
  const castings = await res.json();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Casting Calls</h1>
        <Link href="/admin/casting-status/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Create New
        </Link>
      </div>
      <div className="grid gap-4">
        {castings.map((casting) => (
          <div key={casting._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{casting.title}</h2>
            <p>{casting.description}</p>
            <div className="flex gap-4 mt-2">
              <Link href={`/admin/casting-status/${casting._id}/edit`} className="text-blue-600 underline">
                Edit
              </Link>
              <Link href={`/admin/casting-status/${casting._id}/interested-users`} className="text-green-600 underline">
                View Interested
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
