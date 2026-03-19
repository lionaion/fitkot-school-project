import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const { s3_url, s3_key, file_size, mime_type } = body;

  if (!s3_url || !s3_key || !file_size || !mime_type) {
    return NextResponse.json({ error: "Ontbrekende velden" }, { status: 400 });
  }

  const { error } = await supabase.from("progress_photos").insert({
    user_id: user.id,
    s3_url,
    s3_key,
    file_size,
    mime_type,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
