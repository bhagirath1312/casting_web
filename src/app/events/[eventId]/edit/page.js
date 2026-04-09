"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { eventId } = params;

  const [formData, setFormData] = useState({ title: '', description: '', location: '', date: '' });
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventId) return;
    const fetchEventData = async () => {
      try {
        const eventDocRef = doc(db, 'casting_events', eventId);
        const eventDoc = await getDoc(eventDocRef);
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setFormData({
            title: data.title,
            description: data.description,
            location: data.location,
            date: new Date(data.date.seconds * 1000).toISOString().split('T')[0], // Format date for input
          });
          setExistingImageUrl(data.imageUrl);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        setError("Failed to load event data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      let imageUrl = existingImageUrl;
      // If a new image is selected, upload it and delete the old one
      if (imageFile) {
        const newImageRef = ref(storage, `casting_events/${Date.now()}_${imageFile.name}`);
        await uploadBytesResumable(newImageRef, imageFile);
        imageUrl = await getDownloadURL(newImageRef);

        // Delete the old image
        if (existingImageUrl) {
          const oldImageRef = ref(storage, existingImageUrl);
          await deleteObject(oldImageRef);
        }
      }

      const eventDocRef = doc(db, 'casting_events', eventId);
      await updateDoc(eventDocRef, {
        ...formData,
        date: new Date(formData.date),
        imageUrl: imageUrl,
      });

      alert('Event updated successfully!');
      router.push('/admin');
    } catch (err) {
      console.error("Error updating event:", err);
      setError('Failed to update event.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading event...</div>;

  return (
    <div className="min-h-screen bg-[#F4F0F9] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <Link href="/admin" className="text-sm text-indigo-600 mb-4 inline-block">&larr; Back to Dashboard</Link>
        <h1 className="text-2xl font-bold mb-6">Edit Casting Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Event Title" className="w-full p-3 border rounded-lg" />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-3 border rounded-lg" rows="4"></textarea>
          <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" className="w-full p-3 border rounded-lg" />
          <input name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full p-3 border rounded-lg" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}