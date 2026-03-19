// S3 presigned URL helper
// In production, use @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner

const BUCKET = process.env.AWS_S3_BUCKET ?? "fitkot-photos";
const REGION = process.env.AWS_S3_REGION ?? "eu-west-1";

export function getS3Url(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export function generateS3Key(userId: string, filename: string): string {
  const timestamp = Date.now();
  const ext = filename.split(".").pop();
  return `progress-photos/${userId}/${timestamp}.${ext}`;
}

// TODO: Implement presigned URL generation with AWS SDK
// export async function generatePresignedUrl(key: string, contentType: string) {
//   const client = new S3Client({ region: REGION });
//   const command = new PutObjectCommand({
//     Bucket: BUCKET,
//     Key: key,
//     ContentType: contentType,
//   });
//   const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
//   return { uploadUrl, s3Url: getS3Url(key) };
// }
