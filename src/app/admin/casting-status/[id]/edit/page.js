'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCastingPage() {
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/casting-status/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.imageUrl;

    if (imageFile) {
      imageUrl = await handleImageUpload();
    }

    const updatedForm = { ...form, imageUrl };

    const res = await fetch(`/api/casting-status/${id}`, {
      method: 'PATCH', // ✅ Correct HTTP method
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm),
    });

    if (res.ok) router.push('/admin/casting-status');
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this casting post?');
    if (!confirmed) return;

    const res = await fetch(`/api/casting-status/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/casting-status');
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Casting Call</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {['title', 'description', 'age', 'location', 'phone', 'company'].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="border p-2 rounded"
            required
          />
        ))}

        {/* Image preview */}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Casting"
            className="w-40 h-40 object-cover rounded"
          />
        )}

        {/* Upload new image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}