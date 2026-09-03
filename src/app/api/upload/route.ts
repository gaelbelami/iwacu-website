import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 5MB" },
        { status: 400 }
      );
    }

    const admin = getAdminClient();

    // Sanitize filename and add timestamp for uniqueness
    const sanitized = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();
    const path = `${folder}/${Date.now()}-${sanitized}`;

    const { data, error } = await admin.storage
      .from("images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data: urlData } = admin.storage
      .from("images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
