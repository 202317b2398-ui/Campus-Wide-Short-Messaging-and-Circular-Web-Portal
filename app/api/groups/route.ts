import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: groups, error } = await supabase.from("groups").select("*").order("created_at", { ascending: false })

    if (error) {
      return Response.json({ groups: [] }, { status: 200 })
    }

    return Response.json({ groups: groups || [] })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return Response.json({ groups: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("groups")
      .insert([
        {
          name: body.name,
          members: body.members || [],
        },
      ])
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ data: data?.[0] })
  } catch (error) {
    console.error("Error creating group:", error)
    return Response.json({ error: "Failed to create group" }, { status: 500 })
  }
}
