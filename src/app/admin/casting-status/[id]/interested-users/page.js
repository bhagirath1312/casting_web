import connectDB from "@/lib/mongodb";
import CastingInterest from "@/models/castinginterests";
import { notFound } from "next/navigation";

export default async function InterestedUsersPage({ params }) {
  await connectDB();

  const castingId = params.id;
  if (!castingId) return notFound();

  console.log("📌 Querying for castingId:", castingId);

  let users = [];
  try {
    // ✅ Match string with string
    users = await CastingInterest.find({ castingId }).lean();
  } catch (err) {
    console.error("❌ Error finding casting interests:", err);
    return <div className="text-red-500">Failed to load interested users.</div>;
  }

  console.log("✅ Users found:", users.length);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interested Users</h1>

      {users.length === 0 ? (
        <p>No users have shown interest yet.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Photos</th>
              <th className="p-2 border">Videos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.age}</td>
                <td className="p-2 border">{user.location}</td>
                <td className="p-2 border">
                  <div className="flex flex-wrap gap-2">
                    {user.photoUrls?.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="w-20 h-20 object-cover border rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-2 border">
                  <div className="space-y-1">
                    {user.videoUrls?.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        Video {i + 1}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
