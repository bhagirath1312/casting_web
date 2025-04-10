'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function InterestedFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch user data from DB using email in session
    const fetchUser = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/user?email=${session.user.email}`);
        const data = await res.json();
        setUserData(data);
      }
    };
    fetchUser();
  }, [session]);

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return alert("Max 5 photos allowed");
    setPhotos(files);
  };

  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Max 3 videos allowed");
    setVideos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return;

    const formData = new FormData();
    formData.append('castingId', id);
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('age', userData.age);
    formData.append('location', userData.location);
    formData.append('height', userData.height || '');
    formData.append('weight', userData.weight || '');

    photos.forEach((photo) => formData.append('photos', photo));
    videos.forEach((video) => formData.append('videos', video));

    setSubmitting(true);

    const res = await fetch('/api/casting-interest', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Submitted successfully!');
      router.push('/profile');
    } else {
      alert('Submission failed.');
    }

    setSubmitting(false);
  };

  if (!session) {
    return <div className="p-6">Please log in to submit interest.</div>;
  }

  if (!userData) {
    return <div className="p-6">Loading your data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">I&apos;m Interested</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label>Name</label>
          <input
            value={userData.name}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            value={userData.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Age</label>
          <input
            value={userData.age}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Location</label>
          <input
            value={userData.location}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Height (optional)</label>
          <input
            value={userData.height || ''}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Weight (optional)</label>
          <input
            value={userData.weight || ''}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label>Upload Photos (max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
          />
        </div>

        <div>
          <label>Upload Videos (max 3)</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideosChange}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        >
          {submitting ? 'Submitting...' : 'Submit Interest'}
        </button>
      </form>
    </div>
  );
}
