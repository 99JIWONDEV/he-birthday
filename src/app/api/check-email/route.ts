import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
		}

		// const supabase = createRouteHandlerClient({ cookies });

		// 서비스 롤 키를 사용하여 관리자 권한으로 사용자 검색
		const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

		const { data, error } = await adminClient.auth.admin.listUsers();

		if (error) {
			console.error("User search error:", error);
			return NextResponse.json({ error: "이메일 확인 중 오류가 발생했습니다." }, { status: 500 });
		}

		// 이메일이 존재하는지 확인
		const exists = data.users.some((user) => user.email === email);

		return NextResponse.json({
			exists: exists,
			message: exists ? "이미 가입된 이메일이야!" : "사용 가능해!",
		});
	} catch (error) {
		console.error("Email check error:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
