// app/profile/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";
// import Footer from "@/components/footer";

export default async function ProfilePage() {
  
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your profile</p>
          <Link 
            href="/login" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const { user } = session;

  let castings = [];
  let error = null;
  
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/casting-status`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch casting calls");
    castings = await res.json();
  } catch (err) {
    console.error("Error fetching casting posts:", err);
    error = "Unable to load casting calls. Please try again later.";
  }

  // Calculate member since date (placeholder - replace with actual registration date)
  const memberSinceDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-neutral flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Profile Header */}
<div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
  <div className="bg-gradient-to-r from-[#5B408C] to-purple-300 px-6 py-8 md:px-10">
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <span className="text-4xl md:text-5xl font-bold text-[#5B408C]" aria-hidden="true">
          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {user.name}
        </h1>
        <p className="text-purple-100 text-lg">
          {user.email}
        </p>
      </div>
    </div>
  </div>
            
            <div className="py-4 px-6 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-xs text-gray-500 block">Member Since</span>
                  <span className="text-gray-700 font-medium">{memberSinceDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Casting Calls Section */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Available Casting Calls
                </h2>
                <p className="text-gray-500">Browse and apply to the latest opportunities</p>
              </div>
              
            
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p>{error}</p>
              </div>
            )}

            {!error && castings.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <div className="mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-xl text-gray-700 font-medium">No casting calls available</p>
                <p className="text-gray-500 mt-2">Check back soon for new opportunities</p>
              </div>
            ) : (
              <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {castings.map((casting) => (
                  <div key={casting._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                    <div className="relative w-full h-56">
                      {casting.imageUrl ? (
                        <Image
                          src={casting.imageUrl}
                          alt={casting.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        New
                      </div> */}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{casting.title}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm">{casting.company}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{casting.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm">Age: {casting.age}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm">{casting.phone}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-5">
                        <p className="text-gray-700 text-sm line-clamp-3">{casting.description}</p>
                      </div>
                      
                      <div className="text-center">
                        <Link
                          href={`/casting-status/${casting._id}/interested`}
                          className="block w-full bg-[#5B408C] hover:bg-[#4A3577] text-white py-3 rounded-lg font-medium transition"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="bg-[#5B408C] text-white py-6 mt-1">
        <div className="text-center text-gray-300 text-sm">
          © {new Date().getFullYear()} Casting Nation. All rights reserved.
        </div>
      </div>
    </div>
  );
}
