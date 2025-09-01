"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/header";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				if (error.message.includes("Email not confirmed")) {
					throw new Error("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
				} else if (error.message.includes("Invalid login credentials")) {
					throw new Error("이메일 또는 비밀번호가 올바르지 않아");
				}
				throw error;
			}

			router.push("/gifts");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Header />
			<div className="container mx-auto px-4 text-center flex flex-col gap-4 relative">
				<h1 className="text-2xl font-extrabold text-rose-600">로그인</h1>
				<form onSubmit={handleLogin} className="space-y-4 text-start">
					<div className="space-y-2">
						<label className="text-sm font-medium pl-1">이메일</label>
						<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="이메일을 입력해줘" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium pl-1">비밀번호</label>
						<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="비밀번호를 입력해줘" />
					</div>
					{error && <div className="text-sm text-red-500 text-center">{error}</div>}
					<Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={loading}>
						{loading ? "로그인 중..." : "로그인"}
					</Button>
					<div className="text-center text-sm text-gray-500">
						하은이 로그인이 처음이니?{" "}
						<Link href="/signup" className="text-rose-600 hover:underline">
							회원가입하기
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
