// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function InterestedUsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const params = useParams();
//   const castingId = params?.id;

//   useEffect(() => {
//     if (!castingId) {
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/casting-interest/${castingId}/`);
//         const data = await res.json();
//         setUsers(data);
//       } catch (error) {
//         console.error("Error fetching casting interests:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [castingId]);

//   const handleExportPDF = async () => {
//     setLoading(true); // Disable button while generating PDF

//     const res = await fetch("/api/export-pdf", {
//       method: "POST",
//       body: JSON.stringify({ users }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "interested-users.pdf";
//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     setLoading(false); // Enable button again
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-neutral-100 bg-opacity-75 z-50">
//         <div className="w-16 h-16 border-4 [border-top-color:transparent] [border-right-color:rgb(87,65,135)] [border-bottom-color:rgb(87,65,135)] [border-left-color:rgb(87,65,135)] border-solid rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Interested Users</h1>
//         <div className="text-gray-600">Total Interested: {users.length}</div>
//       </div>

//       {users.length > 0 && (
//         <div className="mb-4 flex gap-4">
//           <button
//             onClick={handleExportPDF}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Export to PDF
//           </button>
//         </div>
//       )}

//       {users.length === 0 ? (
//         <div className="text-center py-6 bg-gray-100 rounded">
//           <p className="text-gray-500">No users have shown interest yet.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 {[
//                   "Name",
//                   "Email",
//                   "Age",
//                   "Location",
//                   "Height",
//                   "Weight",
//                   "Photos",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr
//                   key={`${user.email}-${index}`}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="py-2 px-4 border-b">{user.name}</td>
//                   <td className="py-2 px-4 border-b">{user.email}</td>
//                   <td className="py-2 px-4 border-b">{user.age}</td>
//                   <td className="py-2 px-4 border-b">{user.location}</td>
//                   <td className="py-2 px-4 border-b">{user.height}</td>
//                   <td className="py-2 px-4 border-b">{user.weight}</td>
//                   <td className="py-2 px-4 border-b">
//                     <div className="flex flex-wrap gap-2">
//                       {(user.photoUrls || []).map((url, i) => (
//                         <img
//                           key={i}
//                           src={url}
//                           alt={`photo-${i}`}
//                           className="w-14 h-14 object-cover rounded"
//                         />
//                       ))}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


































// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import { useParams } from "next/navigation";

// export default function InterestedUsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({
//     ageFrom: "",
//     ageTo: "",
//     ageExact: "",
//     gender: "",
//     location: "",
//   });

//   const params = useParams();
//   const castingId = params?.id;

//   useEffect(() => {
//     if (!castingId) {
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/casting-interest/${castingId}/`);
//         const data = await res.json();
//         setUsers(data);
//       } catch (error) {
//         console.error("Error fetching casting interests:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [castingId]);

//   const filteredUsers = useMemo(() => {
//     return users.filter((user) => {
//       const matchesSearch =
//         user.name.toLowerCase().includes(search.toLowerCase()) ||
//         user.email.toLowerCase().includes(search.toLowerCase());

//       const matchesAge =
//         (filters.ageExact
//           ? user.age === Number(filters.ageExact)
//           : (!filters.ageFrom || user.age >= Number(filters.ageFrom)) &&
//           (!filters.ageTo || user.age <= Number(filters.ageTo)));

//       const matchesGender =
//         !filters.gender || user.gender?.toLowerCase() === filters.gender.toLowerCase();

//       const matchesLocation =
//         !filters.location ||
//         user.location.toLowerCase().includes(filters.location.toLowerCase());

//       return matchesSearch && matchesAge && matchesGender && matchesLocation;
//     });
//   }, [users, search, filters]);

//   const handleExportPDF = async () => {
//     setLoading(true);

//     const res = await fetch("/api/export-pdf", {
//       method: "POST",
//       body: JSON.stringify({ users: filteredUsers }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "interested-users.pdf";
//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-neutral-100 bg-opacity-75 z-50">
//         <div className="w-16 h-16 border-4 [border-top-color:transparent] [border-right-color:rgb(87,65,135)] [border-bottom-color:rgb(87,65,135)] [border-left-color:rgb(87,65,135)] border-solid rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Interested Users</h1>
//         <div className="text-gray-600">Total Interested: {filteredUsers.length}</div>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <input
//           type="text"
//           placeholder="Search by name or email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="p-2 rounded-lg w-full bg-white text-black border"
//         />
//         <div className="flex gap-2">
//           <input
//             type="number"
//             placeholder="From Age"
//             value={filters.ageFrom}
//             onChange={(e) => setFilters({ ...filters, ageFrom: e.target.value, ageExact: "" })}
//             className="p-2 rounded-lg w-1/2 bg-white text-black border"
//           />
//           <input
//             type="number"
//             placeholder="To Age"
//             value={filters.ageTo}
//             onChange={(e) => setFilters({ ...filters, ageTo: e.target.value, ageExact: "" })}
//             className="p-2 rounded-lg w-1/2 bg-white text-black border"
//           />
//         </div>
//         <input
//           type="number"
//           placeholder="Exact Age"
//           value={filters.ageExact}
//           onChange={(e) => setFilters({ ...filters, ageExact: e.target.value, ageFrom: "", ageTo: "" })}
//           className="p-2 rounded-lg w-full bg-white text-black border"
//         />
//         <select
//           value={filters.gender}
//           onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
//           className="p-2 rounded-lg w-full bg-white text-black border"
//         >
//           <option value="">All Genders</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Filter by location"
//           value={filters.location}
//           onChange={(e) => setFilters({ ...filters, location: e.target.value })}
//           className="p-2 rounded-lg w-full bg-white text-black border"
//         />
//       </div>

//       {filteredUsers.length > 0 && (
//         <div className="mb-4 flex gap-4">
//           <button
//             onClick={handleExportPDF}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Export to PDF
//           </button>
//         </div>
//       )}

//       {filteredUsers.length === 0 ? (
//         <div className="text-center py-6 bg-gray-100 rounded">
//           <p className="text-gray-500">No users match the filter criteria.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 {["Name", "Email", "Age", "Location", "Height", "Weight", "Photos", "Videos"].map((header) => (
//                   <th
//                     key={header}
//                     className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user, index) => (
//                 <tr
//                   key={`${user.email}-${index}`}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="py-2 px-4 border-b">{user.name}</td>
//                   <td className="py-2 px-4 border-b">{user.email}</td>
//                   <td className="py-2 px-4 border-b">{user.age}</td>
//                   <td className="py-2 px-4 border-b">{user.location}</td>
//                   <td className="py-2 px-4 border-b">{user.height}</td>
//                   <td className="py-2 px-4 border-b">{user.weight}</td>
//                   <td className="py-2 px-4 border-b">
//                     <div className="flex flex-wrap gap-2">
//                       {(user.photoUrls || []).map((url, i) => {
//                         const cloudfrontUrl = url.startsWith("http")
//                           ? url
//                           : `https://diya9wnfn63f0.cloudfront.net/${url}`;
//                         return (
//                           <img
//                             key={i}
//                             src={cloudfrontUrl}
//                             alt={`photo-${i}`}
//                             className="w-14 h-14 object-cover rounded"
//                             loading="lazy"
//                           />
//                         );
//                       })}
//                     </div>
//                   </td>
//                   <td className="py-2 px-4 border-b">
//                     <div className="flex flex-col gap-1">
//                       {(user.videoUrls || []).map((url, i) => {
//                         // Encode video URL if needed and use CloudFront URL
//                         const videoUrl = url.startsWith("http")
//                           ? url
//                           : `https://diya9wnfn63f0.cloudfront.net/videos/${encodeURIComponent(url)}`;

//                         return (
//                           <a
//                             key={i}
//                             href={videoUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 underline text-sm hover:text-blue-800"
//                           >
//                             Video {i + 1}
//                           </a>
//                         );
//                       })}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }






























"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

export default function InterestedUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    ageFrom: "",
    ageTo: "",
    ageExact: "",
    gender: "",
    location: "",
  });

  const params = useParams();
  const castingId = params?.id;

  useEffect(() => {
    if (!castingId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/casting-interest/${castingId}/`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching casting interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [castingId]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesAge =
        (filters.ageExact
          ? user.age === Number(filters.ageExact)
          : (!filters.ageFrom || user.age >= Number(filters.ageFrom)) &&
          (!filters.ageTo || user.age <= Number(filters.ageTo)));

      const matchesGender =
        !filters.gender || user.gender?.toLowerCase() === filters.gender.toLowerCase();

      const matchesLocation =
        !filters.location ||
        user.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesAge && matchesGender && matchesLocation;
    });
  }, [users, search, filters]);

  const handleExportPDF = async () => {
    setLoading(true);

    const res = await fetch("/api/export-pdf", {
      method: "POST",
      body: JSON.stringify({ users: filteredUsers }),
      headers: { "Content-Type": "application/json" },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interested-users.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-100 bg-opacity-75 z-50">
        <div className="w-16 h-16 border-4 [border-top-color:transparent] [border-right-color:rgb(87,65,135)] [border-bottom-color:rgb(87,65,135)] [border-left-color:rgb(87,65,135)] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Interested Users</h1>
        <div className="text-gray-600">Total Interested: {filteredUsers.length}</div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg w-full bg-white text-black border"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="From Age"
            value={filters.ageFrom}
            onChange={(e) => setFilters({ ...filters, ageFrom: e.target.value, ageExact: "" })}
            className="p-2 rounded-lg w-1/2 bg-white text-black border"
          />
          <input
            type="number"
            placeholder="To Age"
            value={filters.ageTo}
            onChange={(e) => setFilters({ ...filters, ageTo: e.target.value, ageExact: "" })}
            className="p-2 rounded-lg w-1/2 bg-white text-black border"
          />
        </div>
        <input
          type="number"
          placeholder="Exact Age"
          value={filters.ageExact}
          onChange={(e) => setFilters({ ...filters, ageExact: e.target.value, ageFrom: "", ageTo: "" })}
          className="p-2 rounded-lg w-full bg-white text-black border"
        />
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="p-2 rounded-lg w-full bg-white text-black border"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="p-2 rounded-lg w-full bg-white text-black border"
        />
      </div>

      {filteredUsers.length > 0 && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={handleExportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to PDF
          </button>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-6 bg-gray-100 rounded">
          <p className="text-gray-500">No users match the filter criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Age", "Location", "Height", "Weight", "Project Links", "Photos", "Videos"].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={`${user.email}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.age}</td>
                  <td className="py-2 px-4 border-b">{user.location}</td>
  
                  <td className="py-2 px-4 border-b">{user.height}</td>
                  <td className="py-2 px-4 border-b">{user.weight}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-col gap-1">
                      {(user.projectLinks || []).map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm hover:text-blue-800 truncate max-w-xs"
                          title={link}
                        >
                          {link.replace(/^https?:\/\/(www\.)?/, '').substring(0, 30)}
                          {link.length > 30 ? '...' : ''}
                        </a>
                      ))}
                      {(!user.projectLinks || user.projectLinks.length === 0) && (
                        <span className="text-gray-400 text-sm">No links provided</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-wrap gap-2">
                      {(user.photoUrls || []).map((url, i) => {
                        const cloudfrontUrl = url.startsWith("http")
                          ? url
                          : `https://diya9wnfn63f0.cloudfront.net/${url}`;
                        return (
                          <img
                            key={i}
                            src={cloudfrontUrl}
                            alt={`photo-${i}`}
                            className="w-14 h-14 object-cover rounded"
                            loading="lazy"
                          />
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-col gap-1">
                      {(user.videoUrls || []).map((url, i) => {
                        // Encode video URL if needed and use CloudFront URL
                        const videoUrl = url.startsWith("http")
                          ? url
                          : `https://diya9wnfn63f0.cloudfront.net/videos/${encodeURIComponent(url)}`;

                        return (
                          <a
                            key={i}
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm hover:text-blue-800"
                          >
                            Video {i + 1}
                          </a>
                        );
                      })}
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