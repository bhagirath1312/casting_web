// app/admin/casting-status/[id]/interested-users/page.js

import connectDB from "@/lib/mongodb";
import CastingInterest from "@/models/castinginterests";
import { notFound } from "next/navigation";

export default async function InterestedUsersPage({ params }) {
    await connectDB();

    // ✅ Safely extract params after await
    const castingId = String(params.id);

    if (!castingId) return notFound();

    console.log("📌 Querying for castingId:", castingId);

    const users = await CastingInterest.find({ castingId }).lean();

    console.log("✅ Users found:", users.length);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Interested Users</h1>

            {users.length === 0 ? (
                <p>No users have shown interest yet.</p>
            ) : (
                <table className="w-full border border-gray-200">
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
                                <div className="flex flex-wrap gap-2">
                                    {user.photoUrls?.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Photo ${i + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                                <td className="p-2 border">
                                    {user.videoUrls?.map((url, i) => (
                                        <a
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-green-500 underline block"
                                        >
                                            Video {i + 1}
                                        </a>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}