import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ notifications })
}
