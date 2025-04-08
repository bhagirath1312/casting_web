'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCastingPage() {
  const [form, setForm] = useState({ title: '', description: '', age: '', location: '', phone: '', company: '', imageUrl: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/casting-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push('/admin/casting-status');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Casting Call</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {['title', 'description', 'age', 'location', 'phone', 'company', 'imageUrl'].map((field) => (
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}