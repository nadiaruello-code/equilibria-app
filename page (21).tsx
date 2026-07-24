import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabaseServer"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/app"

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=lien-invalide", requestUrl.origin)
    )
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Erreur récupération Supabase :", error)

    return NextResponse.redirect(
      new URL("/login?error=lien-expire", requestUrl.origin)
    )
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
