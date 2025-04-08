import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function AdminCastingDashboard() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  const BASE_URL =
    process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${BASE_URL}/api/casting-status`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div className="p-6 text-red-500">Failed to fetch casting calls</div>;
  }

  const castings = await res.json();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Casting Calls</h1>
        <Link href="/admin/casting-status/create">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            + Create New
          </button>
        </Link>
      </div>

      <div className="grid gap-4">
        {castings.map((casting) => (
          <div key={casting._id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{casting.title}</h2>
            <p className="mb-2">{casting.description}</p>
            <div className="text-sm text-gray-600 mb-2">
              <strong>Company:</strong> {casting.company} <br />
              <strong>Location:</strong> {casting.location}
            </div>
            <div className="flex gap-4">
              <Link
                href={`/admin/casting-status/${casting._id}/edit`}
                className="text-blue-600 underline"
              >
                Edit
              </Link>
              <Link
                href={`/admin/casting-status/${casting._id}/interested-users`}
                className="text-green-600 underline"
              >
                View Interested
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
