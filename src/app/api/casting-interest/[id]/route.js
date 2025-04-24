
// // src/api/casting-interest/[id]/route.js
// import connectDB from "@/lib/mongodb";
// import CastingInterest from "@/models/InterestSubmission.js";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   await connectDB();
//   const { id } = params;

//   try {
//     const users = await CastingInterest.find({ castingId: id }).lean();
//     return NextResponse.json({ success: true, users });
//   } catch (err) {
//     return NextResponse.json({ success: false, message: err.message });
//   }
// }
import { connectToDB } from "@/lib/mongodb";
import CastingInterest from "@/models/InterestSubmission";

export async function GET(_req, { params }) {
  const { id } = params;

  try {
    await connectToDB();
    const interests = await CastingInterest.find({ castingId: id }).lean();
    return new Response(JSON.stringify(interests), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Failed to fetch interests", { status: 500 });
  }
}