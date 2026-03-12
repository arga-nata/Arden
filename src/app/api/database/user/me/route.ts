import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { UserService } from "@/logic/dashboard/database/user.service"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const username = cookieStore.get("user_name")?.value // Atau sesuaikan dengan nama cookie auth-mu

    if (!username) {
      return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 })
    }

    const data = await UserService.getMe(username);
    return NextResponse.json({ status: "success", data })
  } catch (err: any) {
    return NextResponse.json({ status: "fail", message: err.message }, { status: 404 })
  }
}