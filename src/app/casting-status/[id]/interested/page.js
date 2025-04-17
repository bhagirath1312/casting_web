'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import { rgb } from 'pdf-lib';

export default function InterestedFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/user?email=${session.user.email}`);
        const data = await res.json();
        setUserData(data);
      }
    };
    fetchUser();
  }, [session]);

  const handlePhotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return alert("Max 5 photos allowed");

    const compressedPhotos = [];
    for (const file of files) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: 'image/webp',
        };
        const compressedFile = await imageCompression(file, options);
        compressedPhotos.push(compressedFile);
      } catch (error) {
        console.error("Compression error:", error);
      }
    }

    setPhotos(compressedPhotos);
  };

  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Max 3 videos allowed");
    setVideos(files);
  };

  const generatePDF = async (data) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    let yPosition = 350;

    // Add Photos to the PDF
    for (const photo of data.photos) {
      const photoBytes = await fetch(photo.url).then((res) => res.arrayBuffer());
      const photoImage = await pdfDoc.embedJpg(photoBytes);
      const photoDims = photoImage.scale(0.5);
      page.drawImage(photoImage, {
        x: 50,
        y: yPosition,
        width: photoDims.width,
        height: photoDims.height,
      });
      yPosition -= photoDims.height + 10;
    }

    // Add Video Links to the PDF
    for (const video of data.videos) {
      page.drawText(`Video Link: ${video.url}`, {
        x: 50,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 1),
      });
      yPosition -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
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
    setUploadProgress(0);

    try {
      const res = await axios.post('/api/casting-interest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      if (res.status === 200) {
        // Fetch response data containing video links and photo URLs
        const data = await res.json();
        
        // Generate PDF
        const pdfBytes = await generatePDF(data);  // Generate PDF with both photos and video links
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Download the generated PDF
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'casting_interest.pdf';
        link.click();

        alert('Submitted successfully!');
        router.push('/profile');
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }

    setSubmitting(false);
    setUploadProgress(0);
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
            disabled={submitting}
            onChange={handlePhotosChange}
          />
        </div>

        <div>
          <label>Upload Videos (max 3)</label>
          <input
            type="file"
            accept="video/*"
            multiple
            disabled={submitting}
            onChange={handleVideosChange}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded w-full"
        >
          {submitting ? 'Uploading...' : 'Submit Interest'}
        </button>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded h-3 mt-2">
            <div
              className="bg-purple-600 h-3 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
            <p className="text-sm text-gray-600 mt-1 text-center">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}
      </form>
    </div>
  );
}