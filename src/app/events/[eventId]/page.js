"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { eventId } = params;
  const { user } = useAuth(); // Get the current user to show the correct button

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const eventDocRef = doc(db, 'casting_events', eventId);
        const eventDoc = await getDoc(eventDocRef);

        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <Link href="/explore" className="text-indigo-600 hover:underline mt-6 inline-block">
          &larr; Back to All Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-64 md:h-96 rounded-lg shadow-lg overflow-hidden mb-8">
            <Image 
              src={event.imageUrl} 
              alt={event.title}
              fill
              className="object-cover"
              priority 
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-6">
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {new Date(event.date.seconds * 1000).toLocaleDateString()}</p>
            </div>
            
            <div className="prose max-w-none text-gray-800">
              <p>{event.description}</p>
            </div>

            {/* Apply Button Section */}
            <div className="mt-8 border-t pt-6 text-center">
              {user ? (
                // If the user is logged in, show the apply link
                <Link href={`/events/${event.id}/apply`} className="inline-block bg-indigo-600 text-white font-bold px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                  Apply Now
                </Link>
              ) : (
                // If the user is not logged in, prompt them to sign in
                <p className="text-gray-700">
                  <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link> to apply for this event.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}