import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ messages })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        title: body.title,
        content: body.content,
        sender: body.sender,
        sender_role: body.senderRole,
        priority: body.priority,
        recipients: body.recipients,
        custom_groups: body.customGroups,
        total_recipients: body.totalRecipients,
        category: body.category,
        attachments: body.attachments,
        schedule_type: body.scheduleType,
        schedule_date: body.scheduleDate,
        schedule_time: body.scheduleTime,
      },
    ])
    .select()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Create notification for the new message
  if (data && data.length > 0) {
    await supabase.from("notifications").insert([
      {
        message_id: data[0].id,
        message: `New message: ${body.title}`,
        read: false,
      },
    ])
  }

  return Response.json({ data: data?.[0] })
}
