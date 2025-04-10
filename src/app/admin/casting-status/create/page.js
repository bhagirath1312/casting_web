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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    let imageUrl = '';

    // 1. Upload to S3 first
    if (form.image) {
      try {
        const uploadForm = new FormData();
        uploadForm.append('file', form.image);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadForm,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || 'Upload failed');
        }

        imageUrl = uploadData.imageUrl;
      } catch (err) {
        setError('Image upload failed');
        console.error(err);
        setUploading(false);
        return;
      }
    }

    // 2. Submit casting post with imageUrl
    try {
      const res = await fetch('/api/casting-status', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
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
      setError('Failed to create casting post');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Casting Call</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" className="w-full border p-2" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full border p-2" onChange={handleChange} required />
        <input name="age" placeholder="Age" className="w-full border p-2" onChange={handleChange} required />
        <input name="location" placeholder="Location" className="w-full border p-2" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" className="w-full border p-2" onChange={handleChange} required />
        <input name="company" placeholder="Company Name" className="w-full border p-2" onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" className="w-full" onChange={handleChange} />

        <button type="submit" disabled={uploading} className="bg-purple-600 text-white py-2 px-4 rounded">
          {uploading ? 'Uploading...' : 'Create Casting Call'}
        </button>
      </form>
    </div>
  );
}