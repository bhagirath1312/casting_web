

// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';
// import { NextResponse } from 'next/server';
// import formidable from 'formidable';
// import fs from 'fs';

// // Disable default body parser
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// async function parseForm(req) {
//   return new Promise((resolve, reject) => {
//     const form = formidable({ multiples: false });
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       else resolve({ fields, files });
//     });
//   });
// }

// export async function POST(req) {
//   try {
//     const { files } = await parseForm(req);

//     const file = files.file[0];
//     const fileStream = fs.createReadStream(file.filepath);
//     const fileExtension = file.originalFilename.split('.').pop();
//     const uniqueFileName = `${uuidv4()}.${fileExtension}`;

//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: uniqueFileName,
//       Body: fileStream,
//       ContentType: file.mimetype,
//     };

//     await s3.send(new PutObjectCommand(uploadParams));

//     const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

//     return NextResponse.json({ imageUrl }, { status: 200 });
//   } catch (error) {
//     console.error('Upload Error:', error);
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//   }
// }

// app/api/upload-image/route.js

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// AWS S3 Client Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Parse multipart form data
async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Upload Route Handler
export async function POST(req) {
  try {
    const { files } = await parseForm(req);

    const file = files.file?.[0];
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileStream = fs.createReadStream(file.filepath);
    const fileExtension = file.originalFilename.split('.').pop();
    const uniqueFileName = `uploads/${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}