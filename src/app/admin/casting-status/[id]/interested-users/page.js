import connectDB from "@/lib/mongodb";
import CastingInterest from "@/models/castinginterests";
import { notFound } from "next/navigation";
import { Types } from "mongoose";

export default async function InterestedUsersPage({ params }) {
  await connectDB();

  const castingId = params.id;
  if (!castingId) return notFound();

  console.log("📌 Querying for castingId:", castingId);

  let users = [];
  try {
    users = await CastingInterest.find({
      castingId: Types.ObjectId(castingId),
    }).lean();
  } catch (err) {
    console.error("❌ Error finding casting interests:", err);
    return <div className="text-red-500">Failed to load data</div>;
  }

  console.log("✅ Users found:", users.length);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interested Users</h1>

      {users.length === 0 ? (
        <p>No users have shown interest yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
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
                          className="w-20 h-20 object-cover rounded border"
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
                          className="text-green-600 underline"
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
        </div>
      )}
    </div>
  );
}
