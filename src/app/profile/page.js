import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";

// Server component – fetch data
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Not authenticated. Please{" "}
        <a href="/login" className="underline text-blue-600">
          login
        </a>.
      </div>
    );
  }

  const { user } = session;

  // Fetch casting posts from API
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/casting-status`, {
    cache: "no-store",
  });
  const castings = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B408C] via-[#8D8B3A] to-[#8E3F67] p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B408C] mb-6 text-center">
          Welcome, {user.name}
        </h1>

        <div className="space-y-2 text-gray-700 mb-10 text-center">
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-[#8E3F67]">Casting Calls</h2>

        {castings.length === 0 ? (
          <p className="text-gray-600">No casting calls available at the moment.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {castings.map((casting) => (
              <div key={casting._id} className="border border-gray-300 rounded-xl p-4 shadow-md bg-gray-50">
                {casting.image && (
                  <div className="mb-3">
                    <Image
                      src={casting.image}
                      alt={casting.title}
                      width={400}
                      height={200}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-[#5B408C]">{casting.title}</h3>
                <p className="text-sm text-gray-600 mt-1"><strong>Company:</strong> {casting.company}</p>
                <p className="text-sm text-gray-600"><strong>Location:</strong> {casting.location}</p>
                <p className="text-sm text-gray-600"><strong>Age:</strong> {casting.age}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {casting.phone}</p>
                <p className="text-sm text-gray-700 mt-2">{casting.description}</p>

                <div className="mt-4">
                  <a
                    href={`/casting-status/${casting._id}/interested`}
                    className="inline-block bg-[#8D8B3A] hover:bg-[#6f6d2e] text-white px-4 py-2 rounded-md text-sm"
                  >
                    I'm Interested
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}