import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// 서비스 롤 키를 사용하여 관리자 권한으로 사용자 목록 가져오기
		const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

		const { data: users, error } = await adminClient.auth.admin.listUsers();

		if (error) {
			console.error("Admin users error:", error);
			return NextResponse.json({ error: "사용자 정보를 가져오는데 실패했습니다." }, { status: 500 });
		}

		return NextResponse.json({ users: users.users });
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
	}
}
