import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("groups")
      .update({
        name: body.name,
        members: body.members,
      })
      .eq("id", params.id)
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ data: data?.[0] })
  } catch (error) {
    console.error("Error updating group:", error)
    return Response.json({ error: "Failed to update group" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("groups").delete().eq("id", params.id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting group:", error)
    return Response.json({ error: "Failed to delete group" }, { status: 500 })
  }
}
