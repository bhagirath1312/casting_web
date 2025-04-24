// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';

// export default function EditCastingPage() {
//   const [form, setForm] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const router = useRouter();
//   const { id } = useParams();

//   useEffect(() => {
//     fetch(`/api/casting-status/${id}`)
//       .then((res) => res.json())
//       .then((data) => setForm(data));
//   }, [id]);

//   const handleImageUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", imageFile);
//     const res = await fetch("/api/upload-image", {
//       method: "POST",
//       body: formData,
//     });
//     const data = await res.json();
//     return data.url;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let imageUrl = form.imageUrl;

//     if (imageFile) {
//       imageUrl = await handleImageUpload();
//     }

//     const updatedForm = { ...form, imageUrl };

//     const res = await fetch(`/api/casting-status/${id}`, {
//       method: 'PATCH', // ✅ Correct HTTP method
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedForm),
//     });

//     if (res.ok) router.push('/admin/casting-status');
//   };

//   const handleDelete = async () => {
//     const confirmed = confirm('Are you sure you want to delete this casting post?');
//     if (!confirmed) return;

//     const res = await fetch(`/api/casting-status/${id}`, { method: 'DELETE' });
//     if (res.ok) router.push('/admin/casting-status');
//   };

//   if (!form) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Edit Casting Call</h1>
//       <form onSubmit={handleSubmit} className="grid gap-4">
//         {['title', 'description', 'age', 'location', 'phone', 'company'].map((field) => (
//           <input
//             key={field}
//             type="text"
//             placeholder={field}
//             value={form[field]}
//             onChange={(e) => setForm({ ...form, [field]: e.target.value })}
//             className="border p-2 rounded"
//             required
//           />
//         ))}

//         {/* Image preview */}
//         {form.imageUrl && (
//           <img
//             src={form.imageUrl}
//             alt="Casting"
//             className="w-40 h-40 object-cover rounded"
//           />
//         )}

//         {/* Upload new image */}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImageFile(e.target.files[0])}
//           className="border p-2 rounded"
//         />

//         <div className="flex gap-4">
//           <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
//             Update
//           </button>
//           <button
//             type="button"
//             onClick={handleDelete}
//             className="bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Delete
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCastingPage() {
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/casting-status/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching casting data:', err);
        setError('Failed to load casting data');
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error('Image upload failed');
    }
    
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    
    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      const updatedForm = { ...form, imageUrl };

      const res = await fetch(`/api/casting-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update casting call');
      }

      router.push('/admin/casting-status');
    } catch (err) {
      console.error('Error updating casting:', err);
      setError(err.message || 'An error occurred while updating');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this casting post?');
    if (!confirmed) return;

    setUpdating(true);
    
    try {
      const res = await fetch(`/api/casting-status/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete casting call');
      }
      
      router.push('/admin/casting-status');
    } catch (err) {
      console.error('Error deleting casting:', err);
      setError(err.message || 'An error occurred while deleting');
      setUpdating(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
  //     </div>
  //   );
  // }

  if (!form) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-xl font-medium text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">Could not load casting data. Please try again later.</p>
          <button 
            onClick={() => router.push('/admin/casting-status')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Back to Casting Calls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-neutral'>
    <div className="max-w-4xl mx-auto p-4 md:p-8  min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Edit Casting Call</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <input 
                  id="age"
                  type="text"
                  value={form.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input 
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="5"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Current Image</label>
                {form.imageUrl && (
                  <div className="relative border rounded-lg p-2 bg-gray-50">
                    <img 
                      src={form.imageUrl} 
                      alt="Current casting image" 
                      className="h-32 object-contain mx-auto"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {preview ? (
                      <div className="relative w-full h-full flex justify-center items-center">
                        <img src={preview} alt="Preview" className="max-h-28 max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={updating}
              className={`flex-1 py-3 px-4 rounded-md text-white font-medium transition duration-200 ease-in-out ${
                updating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              {updating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : 'Update Casting Call'}
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={updating}
              className={`flex-1 py-3 px-4 rounded-md text-white font-medium transition duration-200 ease-in-out ${
                updating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              Delete Casting Call
            </button>
          </div>
          
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.push('/admin/casting-status')}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}