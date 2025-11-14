import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase.from("users").update(body).eq("id", Number.parseInt(id)).select()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data: data?.[0] })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase.from("users").delete().eq("id", Number.parseInt(id))

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
