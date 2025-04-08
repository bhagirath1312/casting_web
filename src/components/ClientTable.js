// "use client";

// import { useState } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { saveAs } from "file-saver";

// export default function ClientTable({ users }) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const exportCSV = () => {
//     const csv = [
//       ["Name", "Email", "Age", "Location", "Height", "Weight"],
//       ...filteredUsers.map((user) => [
//         user.name,
//         user.email,
//         user.age,
//         user.location,
//         user.height,
//         user.weight,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "interested_users.csv");
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [["Name", "Email", "Age", "Location", "Height", "Weight"]],
//       body: filteredUsers.map((user) => [
//         user.name,
//         user.email,
//         user.age,
//         user.location,
//         user.height,
//         user.weight,
//       ]),
//     });
//     doc.save("interested_users.pdf");
//   };

//   return (
//     <>
//       <div className="flex items-center gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Search by name or email"
//           className="border px-3 py-2 rounded w-80"
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Export CSV
//         </button>
//         <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded">
//           Export PDF
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="px-4 py-2 border">Photos</th>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Email</th>
//               <th className="px-4 py-2 border">Age</th>
//               <th className="px-4 py-2 border">Location</th>
//               <th className="px-4 py-2 border">Height</th>
//               <th className="px-4 py-2 border">Weight</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user, index) => (
//               <tr key={index}>
//                 <td className="px-4 py-2 border">
//                   {user.photos && user.photos.length > 0 ? (
//                     <div className="flex flex-wrap gap-2">
//                       {user.photos.map((photo, i) => (
//                         <img
//                           key={i}
//                           src={photo}
//                           alt={`User Photo ${i + 1}`}
//                           className="w-16 h-16 object-cover rounded border"
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <span className="text-gray-500">No Photos</span>
//                   )}
//                 </td>
//                 <td className="px-4 py-2 border">{user.name}</td>
//                 <td className="px-4 py-2 border">{user.email}</td>
//                 <td className="px-4 py-2 border">{user.age}</td>
//                 <td className="px-4 py-2 border">{user.location}</td>
//                 <td className="px-4 py-2 border">{user.height}</td>
//                 <td className="px-4 py-2 border">{user.weight}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";

export default function ClientTable({ data }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by name..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Photos</th>
            <th className="border p-2">Videos</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.location}</td>
                <td className="border p-2">{user.age}</td>
                <td className="border p-2">
                  {user.photoUrls?.map((url, i) => (
                    <img key={i} src={url} alt="Photo" className="w-12 h-12 inline-block mr-1" />
                  ))}
                </td>
                <td className="border p-2">
                  {user.videoUrls?.map((url, i) => (
                    <video key={i} src={url} controls className="w-20 h-12 inline-block mr-1" />
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}