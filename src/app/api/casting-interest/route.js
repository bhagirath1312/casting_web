// // /api/casting-interest/route.js
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// // AWS Config
// const s3 = new S3Client({
//   region: "eu-north-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function POST(req) {
  
//   try {
//     const formData = await req.formData();

//     const castingId = formData.get("castingId");
//     const name = formData.get("name");
//     const email = formData.get("email");
//     const age = formData.get("age");
//     const location = formData.get("location");
//     const height = formData.get("height");
//     const weight = formData.get("weight");

//     const photos = formData.getAll("photos");
//     const videos = formData.getAll("videos");

//     await connectToDatabase();

//     const photoUrls = [];
//     for (const file of photos) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `photos/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       photoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
//     }

//     const videoUrls = [];
//     for (const file of videos) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `videos/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       videoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
//     }

//     const newInterest = new CastingInterest({
//       castingId,
//       name,
//       email,
//       age,
//       location,
//       height,
//       weight,
//       photoUrls,
//       videoUrls,
//     });

//     await newInterest.save();

//     return NextResponse.json({ message: "Interest submitted successfully" });
//   } catch (error) {
//     console.error("Casting interest error:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }



















































//src/app/api/casting-interest/route.js
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function POST(req) {
//   await connectToDatabase();

//   const formData = await req.formData();
//   const email = formData.get("email");
//   const castingId = formData.get("castingId");

//   const alreadyExists = await CastingInterest.findOne({ email, castingId });
//   if (alreadyExists) {
//     return new Response(JSON.stringify({ message: "Already submitted" }), {
//       status: 409,
//     });
//   }

//   try {
//     const name = formData.get("name");
//     const age = formData.get("age");
//     const location = formData.get("location");
//     const height = formData.get("height");
//     const weight = formData.get("weight");

//     const photos = formData.getAll("photos");
//     const videos = formData.getAll("videos");

//     const photoUrls = [];
//     for (const file of photos) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `photos/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       photoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
//     }

//     const videoUrls = [];
//     for (const file of videos) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `videos/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       videoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
//     }

//     const newInterest = new CastingInterest({
//       castingId,
//       name,
//       email,
//       age,
//       location,
//       height,
//       weight,
//       photoUrls,
//       videoUrls,
//     });

//     await newInterest.save();

//     return NextResponse.json({ message: "Interest submitted successfully" });
//   } catch (error) {
//     console.error("Casting interest error:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }







































// // // src/app/api/casting-interest/route.js
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function POST(req) {
//   await connectToDatabase();

//   const formData = await req.formData();
//   const email = formData.get("email");
//   const castingId = formData.get("castingId");

//   const alreadyExists = await CastingInterest.findOne({ email, castingId });
//   if (alreadyExists) {
//     return new Response(JSON.stringify({ message: "Already submitted" }), {
//       status: 409,
//     });
//   }

//   try {
//     const name = formData.get("name");
//     const age = formData.get("age");
//     const location = formData.get("location");
//     const height = formData.get("height");
//     const weight = formData.get("weight");

//     const photos = formData.getAll("photos");
//     const videos = formData.getAll("videos");

//     const photoUrls = [];
//     for (const file of photos) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `photos/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//         ACL: "public-read"
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       photoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
//     }

//     const videoUrls = [];
//     for (const file of videos) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `videos/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//         ACL: "public-read"
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       videoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
//     }

//     // 🔥 FIX: match schema keys
//     const newInterest = new CastingInterest({
//       castingId,
//       name,
//       email,
//       age,
//       location,
//       height,
//       weight,
//       photoUrls, // ✅
//       videoUrls, // ✅
//     });

//     await newInterest.save();

//     return NextResponse.json({ message: "Interest submitted successfully" });
//   } catch (error) {
//     console.error("Casting interest error:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }












































// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import CastingInterest from "@/models/castinginterests";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const uploadFiles = async (files, folder) => {
//   const fileUrls = await Promise.all(
//     files.map(async (file) => {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `${folder}/${uuidv4()}-${file.name}`;
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//         Body: buffer,
//         ContentType: file.type,
//         ACL: "public-read",
//       };
//       await s3.send(new PutObjectCommand(uploadParams));
//       return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
//     })
//   );
//   return fileUrls;
// };

// export async function POST(req) {
//   await connectToDatabase();

//   const formData = await req.formData();
//   const email = formData.get("email");
//   const castingId = formData.get("castingId");

//   const alreadyExists = await CastingInterest.findOne({ email, castingId });
//   if (alreadyExists) {
//     return new Response(JSON.stringify({ message: "Already submitted" }), {
//       status: 409,
//     });
//   }

//   try {
//     const name = formData.get("name");
//     const age = formData.get("age");
//     const location = formData.get("location");
//     const height = formData.get("height");
//     const weight = formData.get("weight");

//     const photos = formData.getAll("photos");
//     const videos = formData.getAll("videos");

//     // Upload both photos and videos in parallel
//     const photoUrls = await uploadFiles(photos, "photos");
//     const videoUrls = await uploadFiles(videos, "videos");

//     const newInterest = new CastingInterest({
//       castingId,
//       name,
//       email,
//       age,
//       location,
//       height,
//       weight,
//       photoUrls,
//       videoUrls,
//     });

//     await newInterest.save();

//     return NextResponse.json({ message: "Interest submitted successfully" });
//   } catch (error) {
//     console.error("Casting interest error:", error);
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }

















import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CastingInterest from "@/models/InterestSubmission";
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { pipeline } from 'stream';
import { promisify } from 'util';
import fs from 'fs';

// Create a pipeline to convert streams to buffers
const streamToBuffer = promisify(pipeline);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFiles = async (files, folder) => {
  const fileUrls = await Promise.all(
    files.map(async (file) => {
      const filename = `${folder}/${uuidv4()}-${file.name}`;
      const fileSize = file.size;

      // Step 1: Create Multipart Upload
      const createUploadCommand = new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        ContentType: file.type,
      });

      const { UploadId } = await s3.send(createUploadCommand);

      // Step 2: Upload file parts
      const partSize = 10 * 1024 * 1024; // 10MB per part
      let byteStart = 0;
      let partNumber = 1;
      const parts = [];

      // Use the file stream and convert it into buffer
      const fileStream = file.stream();
      let buffer = [];
      for await (const chunk of fileStream) {
        buffer.push(chunk);
      }

      // Convert buffer array to a single buffer
      buffer = Buffer.concat(buffer);

      while (byteStart < fileSize) {
        const partBuffer = buffer.slice(byteStart, byteStart + partSize);

        const uploadPartCommand = new UploadPartCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filename,
          PartNumber: partNumber,
          UploadId,
          Body: partBuffer,
        });

        const { ETag } = await s3.send(uploadPartCommand);
        parts.push({ PartNumber: partNumber, ETag });

        byteStart += partSize;
        partNumber += 1;
      }

      // Step 3: Complete Multipart Upload
      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        UploadId,
        MultipartUpload: { Parts: parts },
      });

      await s3.send(completeCommand);

      return `https://${process.env.AWS_BUCKET_NAME}.s3-accelerate.amazonaws.com/${filename}`;
    })
  );
  return fileUrls;
};

export async function POST(req) {
  await connectToDatabase();

  const formData = await req.formData();
  console.log("Form Data:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const email = formData.get("email");
  const castingId = formData.get("castingId");

  let alreadyExists;
  try {
    alreadyExists = await CastingInterest.findOne({ email, castingId });
  } catch (err) {
    console.error("Error checking for duplicate entry:", err);
    return NextResponse.json({ message: "Database query failed" }, { status: 500 });
  }

  if (alreadyExists) {
    return new Response(JSON.stringify({ message: "Already submitted" }), {
      status: 409,
    });
  }

  try {
    const name = formData.get("name");
    const age = formData.get("age");
    const location = formData.get("location");
    const height = formData.get("height");
    const weight = formData.get("weight");

    let projectLinks = [];
    const projectLinksData = formData.get("projectLinks");
    if (projectLinksData) {
      try {
        projectLinks = JSON.parse(projectLinksData);
      } catch (e) {
        console.error("Error parsing project links:", e);
      }
    }

    const photos = formData.getAll("photos");
    const videos = formData.getAll("videos");

    const photoUrls = await uploadFiles(photos, "photos");
    const videoUrls = await uploadFiles(videos, "videos");

    const newInterest = new CastingInterest({
      castingId,
      name,
      email,
      age,
      location,
      height,
      weight,
      photoUrls,
      videoUrls,
    });

    if (Array.isArray(projectLinks) && projectLinks.every(link => typeof link === "string")) {
      newInterest.projectLinks = projectLinks;
    }

    await newInterest.save();

    return NextResponse.json({
      message: "Interest submitted successfully",
      data: {
        name,
        email,
        projectLinksCount: projectLinks.length
      }
    });
  } catch (error) {
    console.error("Casting interest error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}