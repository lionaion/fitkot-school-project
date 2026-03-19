import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const { filename, contentType, fileSize } = body;

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Alleen JPEG en PNG bestanden zijn toegestaan" },
      { status: 400 }
    );
  }

  if (fileSize > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Bestand mag maximaal 5MB zijn" },
      { status: 400 }
    );
  }

  // Generate S3 key
  const timestamp = Date.now();
  const ext = filename.split(".").pop();
  const s3Key = `progress-photos/${user.id}/${timestamp}.${ext}`;

  // In production, generate a presigned URL using AWS SDK
  // For now, return a placeholder that the S3 helper would generate
  const bucket = process.env.AWS_S3_BUCKET ?? "fitkot-photos";
  const region = process.env.AWS_S3_REGION ?? "eu-west-1";
  const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;

  // TODO: Use AWS SDK to generate presigned PUT URL
  // const { uploadUrl } = await generatePresignedUrl(s3Key, contentType);

  return NextResponse.json({
    uploadUrl: s3Url, // Replace with presigned URL in production
    s3Key,
    s3Url,
  });
}
