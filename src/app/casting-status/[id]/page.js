// app/admin/casting-status/[id]/edit/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditCastingPage({ params }) {
  const router = useRouter();
  const [casting, setCasting] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    age: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    const fetchCasting = async () => {
      const res = await fetch(`/api/casting-status/${params.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setCasting(data);
      setForm(data);
    };
    fetchCasting();
  }, [params.id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/casting-status/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/admin/casting-status");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this casting?")) return;
    const res = await fetch(`/api/casting-status/${params.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.push("/admin/casting-status");
  };

  if (!casting) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Casting</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2"
        />
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full border p-2"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2"
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          className="w-full border p-2"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
          <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}