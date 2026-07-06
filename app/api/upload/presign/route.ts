import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const filename = body.filename as string | undefined;
    const folder = (body.folder as string) || "uploads";

    if (!filename) {
      return NextResponse.json({ error: "filename required" }, { status: 400 });
    }

    // Generate unique key
    const ext = filename.split(".").pop() || "bin";
    const key = `${folder}/${crypto.randomUUID()}.${ext}`;

    // For Yandex Object Storage / S3-compatible
    const bucket = process.env.S3_BUCKET || "vzmorie";
    const endpoint = process.env.S3_ENDPOINT || "https://storage.yandexcloud.net";

    // Generate presigned URL (simplified - use AWS SDK in production)
    const uploadUrl = `${endpoint}/${bucket}/${key}`;

    // Public URL for accessing the file
    const publicUrl = `${endpoint}/${bucket}/${key}`;

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
