// src/app/admin/casting-status/page.js

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminCastingDashboard() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return <div className="p-6 text-red-500 font-medium">Access Denied</div>;
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/casting-status`, { cache: 'no-store' });
  const castings = await res.json();

  return (
    <div className="min-h-screen bg-neutral">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Casting Call Management</h1>
            <p className="mt-2 text-gray-600">Manage and monitor all casting calls in your system</p>
          </div>
          <Link
            href="/admin/casting-status/create"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Casting Call
          </Link>
        </div>

        {/* Content */}
        {castings.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-12">
            <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No casting calls found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new casting call</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {castings.map((casting) => (
              <div
                key={casting._id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={casting.imageUrl || '/default-image.jpg'}
                    alt={casting.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30" />
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">
                    {casting.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                    {casting.description}
                  </p>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="font-medium text-gray-900">{casting.applicantCount || 0}</div>
                    <div className="text-gray-500">Applicants</div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/casting-status/${casting._id}/edit`}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/casting-status/${casting._id}/interested-users`}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-neutral-100"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}