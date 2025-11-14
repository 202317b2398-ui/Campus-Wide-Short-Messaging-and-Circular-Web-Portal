import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", Number.parseInt(id))
    .select()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data: data?.[0] })
}
