"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ApplicantDetailPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { eventId, applicantId } = params;
  
  const [applicant, setApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || userProfile?.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (authLoading) return;

    const fetchApplicantData = async () => {
      try {
        const applicantDocRef = doc(db, 'casting_events', eventId, 'applicants', applicantId);
        const applicantDoc = await getDoc(applicantDocRef);

        if (applicantDoc.exists()) {
          const data = applicantDoc.data();
          setApplicant(data);
          // Set the first photo as the main image by default
          if (data.photos && data.photos.length > 0) {
            setMainImage(data.photos[0]);
          }
        } else {
          console.error("Applicant not found");
        }
      } catch (error) {
        console.error("Error fetching applicant details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplicantData();
  }, [eventId, applicantId, user, userProfile, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-20">
        <p>Applicant data could not be found.</p>
        <Link href={`/admin/events/${eventId}/applicants`} className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Applicants List
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/admin/events/${eventId}/applicants`} className="text-sm text-indigo-600 hover:underline mb-6 inline-block">
          &larr; Back to All Applicants
        </Link>
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Gallery Column */}
            <div className="lg:col-span-1">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                <Image src={mainImage} alt="Main profile photo" fill className="object-cover" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {applicant.photos.map((photo, index) => (
                  <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden cursor-pointer" onClick={() => setMainImage(photo)}>
                    <Image src={photo} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Details Column */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900">{applicant.name}</h1>
              <p className="text-gray-600 mt-1">Applied on: {new Date(applicant.appliedAt.seconds * 1000).toLocaleDateString()}</p>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between"><dt className="font-medium text-gray-500">Email</dt><dd className="text-gray-900"><a href={`mailto:${applicant.email}`} className="text-indigo-600 hover:underline">{applicant.email}</a></dd></div>
                  <div className="flex justify-between"><dt className="font-medium text-gray-500">Phone</dt><dd className="text-gray-900">{applicant.phone || 'N/A'}</dd></div>
                  <div className="flex justify-between"><dt className="font-medium text-gray-500">Address</dt><dd className="text-gray-900 text-right">{applicant.address || 'N/A'}</dd></div>
                </dl>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Details</h3>
                <dl className="grid grid-cols-3 gap-4">
                  <div><dt className="font-medium text-gray-500">Age</dt><dd className="text-gray-900 text-lg">{applicant.age || 'N/A'}</dd></div>
                  <div><dt className="font-medium text-gray-500">Height</dt><dd className="text-gray-900 text-lg">{applicant.height || 'N/A'}</dd></div>
                  <div><dt className="font-medium text-gray-500">Weight</dt><dd className="text-gray-900 text-lg">{applicant.weight || 'N/A'} kg</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}