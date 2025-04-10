// // app/api/casting-interest/[id]/route.js

// import connectDB from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";
// import { ObjectId } from "mongodb";

// export async function GET(req, context) {
//   await connectDB();
//   const { id } = context.params;

//   const { searchParams } = new URL(req.url);

//   const name = searchParams.get("name") || "";
//   const email = searchParams.get("email") || "";
//   const age = searchParams.get("age") || "";
//   const minAge = parseInt(searchParams.get("minAge")) || 0;
//   const maxAge = parseInt(searchParams.get("maxAge")) || 100;

//   const query = {
//     castingId: new ObjectId(id),
//     ...(name && { name: { $regex: name, $options: "i" } }),
//     ...(email && { email: { $regex: email, $options: "i" } }),
//     ...(age && { age: parseInt(age) }),
//     ...(minAge && maxAge && { age: { $gte: minAge, $lte: maxAge } }),
//   };

//   try {
//     const users = await CastingInterest.find(query).lean();
//     return new Response(JSON.stringify(users), { status: 200 });
//   } catch (err) {
//     return new Response(JSON.stringify({ message: "Error fetching users", err }), { status: 500 });
//   }
// }
// app/api/casting-interest/[id]/route.js

// src/api/casting-interest/[id]/route.js
import connectDB from "@/lib/mongodb";
import CastingInterest from "@/models/InterestSubmission.js";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const users = await CastingInterest.find({ castingId: id }).lean();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}