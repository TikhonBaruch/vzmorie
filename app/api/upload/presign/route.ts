import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType, folder } = await req.json();

  // Generate unique key
  const ext = filename.split(".").pop();
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  // For Yandex Object Storage / S3-compatible
  // In production, use AWS SDK or @aws-sdk/s3-request-presigner
  const bucket = process.env.S3_BUCKET || "vzmorie";
  const endpoint = process.env.S3_ENDPOINT || "https://storage.yandexcloud.net";
  const region = process.env.S3_REGION || "ru-central1";

  // Generate presigned URL (simplified - use AWS SDK in production)
  const uploadUrl = `${endpoint}/${bucket}/${key}`;

  // Public URL for accessing the file
  const publicUrl = `${endpoint}/${bucket}/${key}`;

  return NextResponse.json({
    uploadUrl,
    key,
    publicUrl,
  });
}
