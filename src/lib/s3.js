import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadToS3 = async (buffer, fileName, mimeType, folder = '') => {
  const key = `${folder}/${Date.now()}-${fileName}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read',
  };

  const { Location } = await s3.upload(uploadParams).promise();
  return Location;
};