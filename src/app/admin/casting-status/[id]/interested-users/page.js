// // app/admin/casting-status/[id]/interested-users/page.js
// import { connectToDB } from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";

// export default async function InterestedUsersPage({ params }) {
//   // Validate casting ID
//   const castingId = params?.id;

//   if (!castingId) {
//     return (
//       <div className="p-6">
//         <h1 className="text-xl text-red-600">❌ Invalid Casting ID</h1>
//       </div>
//     );
//   }

//   // Connect to database
//   await connectToDB();

//   // Fetch interested users for this specific casting
//   const data = await CastingInterest.find({ castingId }).lean();

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Interested Users</h1>
//         <div className="text-gray-600">
//           Total Interested: {data.length}
//         </div>
//       </div>

//       {data.length === 0 ? (
//         <div className="text-center py-6 bg-gray-100 rounded">
//           <p className="text-gray-500">No users have shown interest yet.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 {[
//                   'Name', 'Email', 'Age', 'Location', 
//                   'Height', 'Weight'
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
//               {data.map((user, index) => (
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
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// // Optional: Metadata for the page
// export const metadata = {
//   title: 'Interested Users | Casting Management',
//   description: 'View users interested in the current casting'
// };

// app/admin/casting-status/[id]/interested-users/page.js
import { connectToDB } from "@/lib/mongodb";
import CastingInterest from "@/models/castinginterests";

export default async function InterestedUsersPage({ params }) {
  const castingId = params?.id;
  if (!castingId) {
    return (
      <div className="p-6">
        <h1 className="text-xl text-red-600">❌ Invalid Casting ID</h1>
      </div>
    );
  }

  await connectToDB();
  const data = await CastingInterest.find({ castingId }).lean();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Interested Users</h1>
        <div className="text-gray-600">Total Interested: {data.length}</div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 bg-gray-100 rounded">
          <p className="text-gray-500">No users have shown interest yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Age",
                  "Location",
                  "Height",
                  "Weight",
                  "Photos",
                ].map((header) => (
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
              {data.map((user, index) => (
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
                    <div className="flex flex-wrap gap-2">
                      {(user.photoUrls || []).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`photo-${i}`}
                          className="w-14 h-14 object-cover rounded"
                        />
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

export const metadata = {
  title: "Interested Users | Casting Management",
  description: "View users interested in the current casting",
};