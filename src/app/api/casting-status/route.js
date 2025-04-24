
// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Casting from '@/models/casting';
// import CastingInterest from '@/models/InterestSubmission'; 

// export async function GET() {
//   try {
//     await connectDB();
//     const castings = await Casting.find().sort({ createdAt: -1 });

//     const results = await Promise.all(
//       castings.map(async (casting) => {
//         console.log(`Fetching applicants for casting ID: ${casting._id}`); // Add a log to see which casting we're checking

//         const applicantCount = await CastingInterest.countDocuments({ castingId: casting._id });
//         console.log(`Casting ID: ${casting._id} - Applicants Found: ${applicantCount}`); // Log the result

//         return {
//           ...casting.toObject(),
//           applicantCount,
//         };
//       })
//     );

//     return NextResponse.json(results);
//   } catch (err) {
//     console.error('Fetch casting error:', err);
//     return NextResponse.json({ error: 'Failed to fetch casting posts' }, { status: 500 });
//   }
  
// }

// export async function POST(req) {
//   await connectDB();
//   const { title, description, age, location, phone, company, imageUrl } = await req.json();

//   try {
//     const newCasting = new Casting({ title, description, age, location, phone, company, imageUrl });
//     await newCasting.save();
//     return NextResponse.json({ message: 'Casting post created' }, { status: 201 });
//   } catch (err) {
//     console.error('Casting Save Error:', err);
//     return NextResponse.json({ error: 'Failed to create casting post' }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Casting from '@/models/casting';
import CastingInterest from '@/models/InterestSubmission'; 

// GET: Fetch all casting posts OR check if title exists via query param
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');

    // ✅ If title is provided: check for duplicates
    if (title) {
      const normalizedTitle = title.trim().toLowerCase();
      const exists = await Casting.findOne({ title: normalizedTitle });
      return NextResponse.json({ exists: !!exists });
    }

    // ✅ Otherwise: fetch all castings with applicant count
    const castings = await Casting.find().sort({ createdAt: -1 });

    const results = await Promise.all(
      castings.map(async (casting) => {
        const applicantCount = await CastingInterest.countDocuments({ castingId: casting._id });
        return {
          ...casting.toObject(),
          applicantCount,
        };
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error('Fetch casting error:', err);
    return NextResponse.json({ error: 'Failed to fetch casting posts' }, { status: 500 });
  }
}

// POST: Create a new casting post (with backend duplicate prevention)
export async function POST(req) {
  await connectDB();
  const { title, description, age, location, phone, company, imageUrl } = await req.json();

  try {
    const normalizedTitle = title.trim().toLowerCase();

    // ✅ Prevent duplicate title
    const existing = await Casting.findOne({ title: normalizedTitle });
    if (existing) {
      return NextResponse.json({ error: 'A casting post with this title already exists.' }, { status: 409 });
    }

    const newCasting = new Casting({
      title: normalizedTitle,
      description,
      age,
      location,
      phone,
      company,
      imageUrl,
    });

    await newCasting.save();
    return NextResponse.json({ message: 'Casting post created' }, { status: 201 });
  } catch (err) {
    console.error('Casting Save Error:', err);
    return NextResponse.json({ error: 'Failed to create casting post' }, { status: 500 });
  }
}