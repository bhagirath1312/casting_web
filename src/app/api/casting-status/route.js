// // app/api/casting-status/route.js
// import connectDB from "@/lib/mongodb";
// import Casting from "@/models/casting";
// import { NextResponse } from "next/server";

// export async function GET() {
//   await connectDB();
//   const castings = await Casting.find().sort({ createdAt: -1 });
//   return NextResponse.json(castings);
// }

// export async function POST(req) {
//   await connectDB();
//   const data = await req.json();
//   const newCasting = await Casting.create(data);
//   return NextResponse.json(newCasting, { status: 201 });
// }


// // app/api/casting-status/route.js

// import connectDB from "@/lib/mongodb";
// import Casting from "@/models/casting";
// import { NextResponse } from "next/server";
// import { uploadCastingImageToS3 } from "@/lib/s3Uploader";

// export async function POST(req) {
//   await connectDB();

//   const formData = await req.formData();

//   const file = formData.get("image");
//   let imageUrl = "";

//   if (file && file.name) {
//     const buffer = Buffer.from(await file.arrayBuffer());
//     imageUrl = await uploadCastingImageToS3(buffer, file.type);
//   }

//   const newCasting = await Casting.create({
//     title: formData.get("title"),
//     description: formData.get("description"),
//     age: formData.get("age"),
//     location: formData.get("location"),
//     phone: formData.get("phone"),
//     company: formData.get("company"),
//     imageUrl,
//   });

//   return NextResponse.json(newCasting, { status: 201 });
// }

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Casting from '@/models/casting';

export async function GET() {
  try {
    await connectDB();
    const castings = await Casting.find().sort({ createdAt: -1 });
    return NextResponse.json(castings);
  } catch (err) {
    console.error('Fetch casting error:', err);
    return NextResponse.json({ error: 'Failed to fetch casting posts' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const { title, description, age, location, phone, company, imageUrl } = await req.json();

  try {
    const newCasting = new Casting({ title, description, age, location, phone, company, imageUrl });
    await newCasting.save();
    return NextResponse.json({ message: 'Casting post created' }, { status: 201 });
  } catch (err) {
    console.error('Casting Save Error:', err);
    return NextResponse.json({ error: 'Failed to create casting post' }, { status: 500 });
  }
}