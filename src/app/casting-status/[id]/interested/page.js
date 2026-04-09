// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import imageCompression from 'browser-image-compression';
// import axios from 'axios';

// export default function InterestedFormPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { id } = useParams();

//   const [userData, setUserData] = useState({
//     name: '',
//     email: '',
//     age: '',
//     location: '',
//     height: '',
//     weight: ''
//   });
//   const [photos, setPhotos] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [projectLinks, setProjectLinks] = useState(['']);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (session?.user?.email) {
  //       try {
  //         setLoading(true);
  //         const res = await fetch(`/api/user?email=${session.user.email}`);
  //         const data = await res.json();
  //         setUserData({
  //           name: data.name || '',
  //           email: data.email || '',
  //           age: data.age || '',
  //           location: data.location || '',
  //           height: data.height || '',
  //           weight: data.weight || ''
  //         });
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
    
//     if (session?.user?.email) {
//       fetchUser();
//     }
//   }, [session]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePhotosChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 5) {
//       alert("Maximum 5 photos allowed");
//       return;
//     }

//     const compressedPhotos = [];
//     for (const file of files) {
//       try {
//         const options = {
//           maxSizeMB: 0.5,
//           maxWidthOrHeight: 1024,
//           useWebWorker: true,
//           fileType: 'image/webp',
//         };
//         const compressedFile = await imageCompression(file, options);
//         compressedPhotos.push(compressedFile);
//       } catch (error) {
//         console.error("Compression error:", error);
//       }
//     }

//     setPhotos(compressedPhotos);
//   };

//   const handleVideosChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 3) {
//       alert("Maximum 3 videos allowed");
//       return;
//     }
//     setVideos(files);
//   };

  

//   const handleProjectLinkChange = (index, value) => {
//     const newLinks = [...projectLinks];
//     newLinks[index] = value;
//     setProjectLinks(newLinks);
//   };
  
//   const addProjectLink = () => setProjectLinks([...projectLinks, '']);
//   const removeProjectLink = (index) => {
//     if (projectLinks.length > 1) {
//       const newLinks = [...projectLinks];
//       newLinks.splice(index, 1);
//       setProjectLinks(newLinks);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('castingId', id);
//     formData.append('name', userData.name);
//     formData.append('email', userData.email);
//     formData.append('age', userData.age);
//     formData.append('location', userData.location);
//     formData.append('height', userData.height || '');
//     formData.append('weight', userData.weight || '');
//     const validLinks = projectLinks.filter(link => link.trim() !== '');
//     formData.append('projectLinks', JSON.stringify(validLinks));
//     // Append all non-empty project links
//     photos.forEach((photo) => formData.append('photos', photo));
//     videos.forEach((video) => formData.append('videos', video));

//     setSubmitting(true);
//     setUploadProgress(0);

//     try {
//       const res = await axios.post('/api/casting-interest', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percent);
//         },
//       });
  
//       if (res.status === 200) {
//         alert('Submitted successfully!');
//         router.push('/profile');
//       } else if (res.status === 409) {
//         alert('You have already submitted your details for this casting.');
//       } else {
//         alert('Submission failed.');
//       }
//     } catch (err) {
//       console.error("API error:", err);
//       alert('You have already submitted your details for this casting or Something went wrong during submission.');
//     } finally {
//       setSubmitting(false);
//       setUploadProgress(0);
//     }
//   };
 
//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2h-5z" />
//           </svg>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
//           <p className="text-gray-600 mb-6">Please sign in to submit your application</p>
//           <a 
//             href="/login" 
//             className="inline-block bg-[#5B408C] hover:bg-purple-800 text-white font-medium px-6 py-3 rounded-lg transition duration-200 w-full"
//           >
//             Sign In
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="bg-gradient-to-r from-[#5B408C] to-purple-300 p-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-white">Casting Application</h1>
//           <p className="text-purple-100 mt-2">Submit your details to apply for this opportunity</p>
//         </div>
        
//         {loading ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5B408C]"></div>
//             <p className="mt-4 text-gray-600">Loading your profile information...</p>
//           </div>
//         ) : (
//           <div className="p-6 md:p-8">
//             <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     name="name"
//                     value={userData.name}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     name="email"
//                     value={userData.email}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Age</label>
//                   <input
//                     name="age"
//                     value={userData.age}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Location</label>
//                   <input
//                     name="location"
//                     value={userData.location}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Height</label>
//                   <input
//                     name="height"
//                     value={userData.height}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                     placeholder="e.g., 5'10 or 178cm"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-sm font-medium text-gray-700">Weight</label>
//                   <input
//                     name="weight"
//                     value={userData.weight}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                     placeholder="e.g., 160lbs or 72kg"
//                   />
//                 </div>
//               </div>

//               {/* Project Links Section */}
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <label className="block text-sm font-medium text-gray-700">Project Links</label>
//                   <button 
//                     type="button" 
//                     onClick={addProjectLink}
//                     className="text-sm font-medium text-[#5B408C] hover:text-purple-800 flex items-center"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Add Link
//                   </button>
//                 </div>

//                 {projectLinks.map((link, index) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <input
//                       type="url"
//                       value={link}
//                       onChange={(e) => handleProjectLinkChange(index, e.target.value)}
//                       placeholder="https://example.com/your-project"
//                       className="flex-grow p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
//                     />
//                     {projectLinks.length > 1 && (
//                       <button 
//                         type="button" 
//                         onClick={() => removeProjectLink(index)}
//                         className="p-2 text-gray-500 hover:text-red-500 transition-colors"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <p className="text-xs text-gray-500">Add links to your portfolio, social media, or previous work</p>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Upload Photos (max 5)</label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     disabled={submitting}
//                     onChange={handlePhotosChange}
//                     className="hidden"
//                     id="photo-upload"
//                   />
//                   <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <span className="text-base font-medium text-[#5B408C]">Click to select photos</span>
//                     <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP up to 5MB each</span>
//                   </label>
//                 </div>
//                 {photos.length > 0 && (
//                   <p className="text-sm text-green-600 font-medium">{photos.length} photo(s) selected</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Upload Videos (max 3)</label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
//                   <input
//                     type="file"
//                     accept="video/*"
//                     multiple
//                     disabled={submitting}
//                     onChange={handleVideosChange}
//                     className="hidden"
//                     id="video-upload"
//                   />
//                   <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                     </svg>
//                     <span className="text-base font-medium text-[#5B408C]">Click to select videos</span>
//                     <span className="text-xs text-gray-500 mt-1">MP4, MOV up to 50MB each</span>
//                   </label>
//                 </div>
//                 {videos.length > 0 && (
//                   <p className="text-sm text-green-600 font-medium">{videos.length} video(s) selected</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`w-full p-4 rounded-lg font-medium transition-colors duration-200 ${
//                   submitting 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#5B408C] hover:bg-purple-800 text-white'
//                 }`}
//               >
//                 {submitting ? 'Uploading...' : 'Submit Application'}
//               </button>

//               {uploadProgress > 0 && (
//                 <div>
//                   <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//                     <div
//                       className="bg-[#5B408C] h-4 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     />
//                   </div>
//                   <p className="text-sm text-gray-600 mt-2 text-center">
//                     {uploadProgress}% uploaded
//                   </p>
//                 </div>
//               )}
//             </form>
//           </div>
//         )}
//       </div>
      
//     </div>
//       {/* Footer */}
//       <div className="bg-[#5B408C] text-white py-6 mt-12">
//         <div className="text-center text-gray-300 text-sm">
//           © {new Date().getFullYear()} Casting Nation. All rights reserved.
//         </div>
//       </div>
//     </>
//   );
// }





'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import imageCompression from 'browser-image-compression';
import axios from 'axios';

export default function InterestedFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    location: '',
    height: '',
    weight: '',
  });
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projectLinks, setProjectLinks] = useState(['']);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Enhanced upload progress tracking
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [totalUploadSize, setTotalUploadSize] = useState(0);
  const uploadTimer = useRef(null);

  // Calculate total size of files to upload
  useEffect(() => {
    let size = 0;
    photos.forEach(photo => size += photo.size);
    videos.forEach(video => size += video.size);
    setTotalUploadSize(size);
  }, [photos, videos]);

  // Timer for tracking elapsed time during upload
  useEffect(() => {
    if (submitting && uploadStartTime) {
      uploadTimer.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - uploadStartTime) / 1000; // in seconds
        setElapsedTime(elapsed);
        
        // Calculate estimated time remaining
        if (uploadProgress > 0) {
          const totalEstimatedTime = elapsed / (uploadProgress / 100);
          const remaining = totalEstimatedTime - elapsed;
          setEstimatedTimeRemaining(remaining);
          
          // Calculate upload speed (bytes per second)
          const bytesUploaded = totalUploadSize * (uploadProgress / 100);
          const speedBps = bytesUploaded / elapsed;
          setUploadSpeed(speedBps / (1024 * 1024)); // Convert to MB/s
        }
      }, 1000);
    }
    
    return () => {
      if (uploadTimer.current) {
        clearInterval(uploadTimer.current);
      }
    };
  }, [submitting, uploadStartTime, uploadProgress, totalUploadSize]);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          setLoading(true);
          const res = await fetch(`/api/user?email=${session.user.email}`);
          const data = await res.json();
          setUserData({
            name: data.name || '',
            email: data.email || '',
            age: data.age || '',
            location: data.location || '',
            height: data.height || '',
            weight: data.weight || ''
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [session]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Project links handlers
  const addProjectLink = () => {
    setProjectLinks([...projectLinks, '']);
  };

  const handleProjectLinkChange = (index, value) => {
    const updatedLinks = [...projectLinks];
    updatedLinks[index] = value;
    setProjectLinks(updatedLinks);
  };

  const removeProjectLink = (index) => {
    const updatedLinks = [...projectLinks];
    updatedLinks.splice(index, 1);
    setProjectLinks(updatedLinks);
  };

  // Photo upload handler
  const handlePhotosChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      if (photos.length + files.length > 5) {
        alert('You can upload a maximum of 5 photos');
        return;
      }
      
      try {
        // Compress images before storing them
        const compressedFiles = await Promise.all(
          files.map(async (file) => {
            if (file.size > 5 * 1024 * 1024) { // If file is larger than 5MB
              const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
              };
              return await imageCompression(file, options);
            }
            return file;
          })
        );
        
        setPhotos(prev => [...prev, ...compressedFiles]);
      } catch (error) {
        console.error("Error compressing images:", error);
        alert('Error processing images. Please try again.');
      }
    }
  };

  // Video upload handler
  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      if (videos.length + files.length > 3) {
        alert('You can upload a maximum of 3 videos');
        return;
      }
      
      // Check file size
      const oversizedFiles = files.filter(file => file.size > 50 * 1024 * 1024); // 50MB
      if (oversizedFiles.length > 0) {
        alert('One or more videos exceed the 50MB size limit');
        return;
      }
      
      setVideos(prev => [...prev, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('castingId', id);
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('age', userData.age);
    formData.append('location', userData.location);
    formData.append('height', userData.height || '');
    formData.append('weight', userData.weight || '');
    const validLinks = projectLinks.filter(link => link.trim() !== '');
    formData.append('projectLinks', JSON.stringify(validLinks));
    
    photos.forEach((photo) => formData.append('photos', photo));
    videos.forEach((video) => formData.append('videos', video));

    setSubmitting(true);
    setUploadProgress(0);
    setUploadStartTime(Date.now());
    setElapsedTime(0);
    setEstimatedTimeRemaining(null);
    setUploadSpeed(null);

    try {
      const res = await axios.post('/api/casting-interest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
  
      if (res.status === 200) {
        alert('Submitted successfully!');
        router.push('/profile');
      } else if (res.status === 409) {
        alert('You have already submitted your details for this casting.');
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      console.error("API error:", err);
      alert('You have already submitted your details for this casting or Something went wrong during submission.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
      if (uploadTimer.current) {
        clearInterval(uploadTimer.current);
      }
    }
  };

  // Format time function
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size function
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2h-5z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to submit your application</p>
          <a 
            href="/login" 
            className="inline-block bg-[#5B408C] hover:bg-purple-800 text-white font-medium px-6 py-3 rounded-lg transition duration-200 w-full"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#5B408C] to-purple-300 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Casting Application</h1>
          <p className="text-purple-100 mt-2">Submit your details to apply for this opportunity</p>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5B408C]"></div>
            <p className="mt-4 text-gray-600">Loading your profile information...</p>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    name="location"
                    value={userData.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <input
                    name="height"
                    value={userData.height}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    placeholder="e.g., 5'10 or 178cm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  <input
                    name="weight"
                    value={userData.weight}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    placeholder="e.g., 160lbs or 72kg"
                  />
                </div>
              </div>

              {/* Project Links Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Project Links</label>
                  <button 
                    type="button" 
                    onClick={addProjectLink}
                    className="text-sm font-medium text-[#5B408C] hover:text-purple-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Link
                  </button>
                </div>

                {projectLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                      placeholder="https://example.com/your-project"
                      className="flex-grow p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#5B408C] focus:border-transparent"
                    />
                    {projectLinks.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeProjectLink(index)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500">Add links to your portfolio, social media, or previous work</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Upload Photos (max 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={submitting}
                    onChange={handlePhotosChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base font-medium text-[#5B408C]">Click to select photos</span>
                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP up to 5MB each</span>
                  </label>
                </div>
                {photos.length > 0 && (
                  <div>
                    <p className="text-sm text-green-600 font-medium mb-2">{photos.length} photo(s) selected</p>
                    <div className="flex flex-wrap gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Preview ${index}`} 
                            className="h-16 w-16 object-cover rounded-md border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Upload Videos (max 3)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    disabled={submitting}
                    onChange={handleVideosChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base font-medium text-[#5B408C]">Click to select videos</span>
                    <span className="text-xs text-gray-500 mt-1">MP4, MOV up to 50MB each</span>
                  </label>
                </div>
                {videos.length > 0 && (
                  <div>
                    <p className="text-sm text-green-600 font-medium mb-2">{videos.length} video(s) selected</p>
                    <div className="flex flex-col gap-2">
                      {videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm truncate max-w-xs">{video.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({formatFileSize(video.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setVideos(videos.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full p-4 rounded-lg font-medium transition-colors duration-200 ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#5B408C] hover:bg-purple-800 text-white'
                }`}
              >
                {submitting ? 'Uploading...' : 'Submit Application'}
              </button>

              {/* Upload progress UI */}
              {uploadProgress > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Uploading files to S3...</span>
                    <span className="text-sm font-medium text-[#5B408C]">{uploadProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-3">
                    <div
                      className="bg-[#5B408C] h-4 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Size</p>
                      <p className="text-sm font-medium">{formatFileSize(totalUploadSize)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Upload Speed</p>
                      <p className="text-sm font-medium">
                        {uploadSpeed ? `${uploadSpeed.toFixed(2)} MB/s` : "Calculating..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Elapsed Time</p>
                      <p className="text-sm font-medium">{formatTime(elapsedTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time Remaining</p>
                      <p className="text-sm font-medium">
                        {estimatedTimeRemaining ? formatTime(estimatedTimeRemaining) : "Calculating..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
    
    {/* Footer */}
    <div className="bg-[#5B408C] text-white py-6 mt-12">
      <div className="text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} Casting Nation. All rights reserved.
      </div>
    </div>
    </>
  );
}