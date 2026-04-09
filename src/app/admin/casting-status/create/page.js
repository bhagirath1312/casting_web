// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function CreateCastingPage() {
//   const [form, setForm] = useState({ title: '', description: '', age: '', location: '', phone: '', company: '', imageUrl: '' });
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch('/api/casting-status', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) router.push('/admin/casting-status');
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Create Casting Call</h1>
//       <form onSubmit={handleSubmit} className="grid gap-4">
//         {['title', 'description', 'age', 'location', 'phone', 'company', 'imageUrl'].map((field) => (
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
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
//       </form>
//     </div>
//   );
// }
// src/app/admin/casting-status/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCastingPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    age: '',
    location: '',
    phone: '',
    company: '',
    image: null,
  });

  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    const normalizedTitle = form.title.trim().toLowerCase();
    const normalizedCompany = form.company.trim().toLowerCase();

    // Check for duplicate title
    try {
      const checkRes = await fetch(`/api/casting-status?title=${encodeURIComponent(normalizedTitle)}`);
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.exists) {
        setError('A casting call with this title already exists.');
        setUploading(false);
        return;
      }
    } catch (err) {
      console.error('Error checking title:', err);
      setError('Failed to check for duplicate title');
      setUploading(false);
      return;
    }

    let imageUrl = '';

      // ✅ Step 1: Upload image if it exists
    if (form.image) {
      try {
        const uploadForm = new FormData();
        uploadForm.append('file', form.image);
        uploadForm.append("castingTitle", form.title);
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadForm,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Upload failed');
        }

        imageUrl = uploadData.imageUrl;
      } catch (err) {
        console.error(err);
        setError('Image upload failed');
        setUploading(false);
        return;
      }
    }

    // Create casting call
    try {
      const res = await fetch('/api/casting-status', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          title: normalizedTitle,
          company: normalizedCompany,
          imageUrl,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      router.push('/admin/casting-status');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create casting post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='bg-neutral'>

    
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#5B408C]">Create Casting Call</h1>
        
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
                  name="title" 
                  placeholder="Casting call title" 
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <input 
                  id="age"
                  name="age" 
                  placeholder="e.g. 18-25" 
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  id="location"
                  name="location" 
                  placeholder="City, State" 
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  id="company"
                  name="company" 
                  placeholder="Your production company" 
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input 
                  id="phone"
                  name="phone" 
                  placeholder="(555) 555-5555" 
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  id="description"
                  name="description" 
                  placeholder="Detailed description of the role" 
                  rows="5"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
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
                      name="image" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleChange} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition duration-200 ease-in-out ${
                uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#5B408C] hover:bg-[#4A3577] shadow-md hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : 'Create Casting Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}