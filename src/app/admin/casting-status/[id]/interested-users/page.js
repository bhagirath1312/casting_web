// import connectDB from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";
// import { notFound } from "next/navigation";

// export default async function InterestedUsersPage({ params }) {
//   await connectDB();

//   const castingId = params.id;
//   if (!castingId) return notFound();

//   console.log("📌 Querying for castingId:", castingId);

//   let users = [];
//   try {
//     // ✅ Match string with string
//     users = await CastingInterest.find({ castingId }).lean();
//   } catch (err) {
//     console.error("❌ Error finding casting interests:", err);
//     return <div className="text-red-500">Failed to load interested users.</div>;
//   }

//   console.log("✅ Users found:", users.length);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Interested Users</h1>

//       {users.length === 0 ? (
//         <p>No users have shown interest yet.</p>
//       ) : (
//         <table className="w-full border border-gray-200 text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border">Name</th>
//               <th className="p-2 border">Email</th>
//               <th className="p-2 border">Age</th>
//               <th className="p-2 border">Location</th>
//               <th className="p-2 border">Photos</th>
//               <th className="p-2 border">Videos</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td className="p-2 border">{user.name}</td>
//                 <td className="p-2 border">{user.email}</td>
//                 <td className="p-2 border">{user.age}</td>
//                 <td className="p-2 border">{user.location}</td>
//                 <td className="p-2 border">
//                   <div className="flex flex-wrap gap-2">
//                     {user.photoUrls?.map((url, i) => (
//                       <img
//                         key={i}
//                         src={url}
//                         alt={`Photo ${i + 1}`}
//                         className="w-20 h-20 object-cover border rounded"
//                       />
//                     ))}
//                   </div>
//                 </td>
//                 <td className="p-2 border">
//                   <div className="space-y-1">
//                     {user.videoUrls?.map((url, i) => (
//                       <a
//                         key={i}
//                         href={url}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-blue-500 underline"
//                       >
//                         Video {i + 1}
//                       </a>
//                     ))}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function InterestedUsersPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const castingId = params.id;

  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    age: '',
    minAge: '',
    maxAge: '',
  });

  const fetchUsers = async () => {
    const query = new URLSearchParams(filters);
    const res = await fetch(`/api/casting-interest/${castingId}?${query.toString()}`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Email', 'Age', 'Location']],
      body: users.map((u) => [u.name, u.email, u.age, u.location]),
    });
    doc.save('interested_users.pdf');
  };

  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Age', key: 'age' },
    { label: 'Location', key: 'location' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interested Users</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Name"
          className="border p-2 rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Email"
          className="border p-2 rounded"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age Equal"
          className="border p-2 rounded"
          value={filters.age}
          onChange={(e) => setFilters({ ...filters, age: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Age"
          className="border p-2 rounded"
          value={filters.minAge}
          onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Age"
          className="border p-2 rounded"
          value={filters.maxAge}
          onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
          Export PDF
        </button>
        <CSVLink
          data={users}
          headers={csvHeaders}
          filename="interested_users.csv"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </CSVLink>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
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
                <td className="p-2 border">
                  <div className="flex flex-wrap gap-1">
                    {user.photoUrls?.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-2 border">
                  {user.videoUrls?.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline block"
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
