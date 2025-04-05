import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Not authenticated. Please <a href="/login" className="underline text-blue-600">login</a>.
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5B408C] via-[#8D8B3A] to-[#8E3F67] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-[#5B408C] mb-6 text-center">
          Welcome, {user.name}
        </h1>

        <div className="space-y-3 text-gray-700">
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="mt-6 w-full bg-[#8E3F67] text-white py-2 rounded-lg hover:bg-[#732c52] transition-all duration-200"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}