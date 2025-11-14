import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ users })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: body.name,
        email: body.email,
        role: body.role,
        status: body.status || "active",
        age: body.age,
        blood_group: body.bloodGroup,
        phone_number: body.phoneNumber,
        department: body.department,
        course: body.course,
        sub_course: body.subCourse,
        dob: body.dob,
        parent_phone_number: body.parentPhoneNumber,
        responsible_staff: body.responsibleStaff,
        password: body.password,
      },
    ])
    .select()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data: data?.[0] })
}
