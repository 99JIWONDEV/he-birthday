"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/ui/header";

interface SignUpForm {
	email: string;
	password: string;
	passwordConfirm: string;
}

export default function SignUpPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<SignUpForm>({
		email: "",
		password: "",
		passwordConfirm: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showEmailVerification, setShowEmailVerification] = useState(false);
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (name === "email") {
			setIsEmailVerified(false);
		}
		setError("");
	};

	const checkEmailDuplicate = async () => {
		if (!formData.email) {
			setError("이메일을 입력해주세요.");
			return;
		}

		setIsCheckingEmail(true);
		setError("");

		try {
			// 서버리스 함수를 통해 이메일 중복 확인
			const response = await fetch("/api/check-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: formData.email }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "이메일 확인 중 오류가 발생했습니다.");
			}

			const data = await response.json();
			console.log("서버 응답:", data); // 디버깅용

			setError(data.message);
			setIsEmailVerified(!data.exists);
		} catch (err) {
			console.error("이메일 중복 확인 오류:", err);
			setError(err instanceof Error ? err.message : "이메일 확인 중 오류가 발생했습니다.");
			setIsEmailVerified(false);
		} finally {
			setIsCheckingEmail(false);
		}
	};

	const validateForm = (): boolean => {
		if (!isEmailVerified) {
			setError("이메일 중복 확인이 필요합니다.");
			return false;
		}
		if (formData.password !== formData.passwordConfirm) {
			setError("비밀번호가 일치하지 않습니다.");
			return false;
		}
		if (formData.password.length < 6) {
			setError("비밀번호는 6자 이상이어야 합니다.");
			return false;
		}

		return true;
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		setError("");
		setShowEmailVerification(false);

		try {
			// 먼저 로그인 시도로 계정 존재 여부 확인
			const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: "dummy-password",
			});

			// 로그인 시도가 성공하거나 특정 에러가 아닌 경우는 이미 계정이 존재하는 것
			if (existingUser?.user || (signInError && !signInError.message.includes("Invalid login credentials"))) {
				setError("이미 가입된 이메일입니다.");
				setLoading(false);
				return;
			}

			// 회원가입 시도
			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				// 이미 가입된 이메일인 경우
				if (error.message.includes("already") || error.status === 400) {
					setError("이미 가입된 이메일입니다.");
					return;
				}
				throw error;
			}

			// 회원가입 성공 및 이메일 미인증 상태일 때만 인증 화면 표시
			if (data?.user && !data.user.confirmed_at) {
				setShowEmailVerification(true);
				setFormData({
					email: "",
					password: "",
					passwordConfirm: "",
				});
			}
		} catch (err) {
			console.error("회원가입 오류:", err);
			setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<div className="flex-1 flex items-center justify-center -mt-[120px]">
				<div className="container mx-auto px-4 text-center flex flex-col gap-4 relative">
					{showEmailVerification ? (
						<div className="text-center">
							<h1 className="text-2xl font-extrabold text-rose-600">이메일 인증</h1>
							<p className="mt-4 text-gray-600">입력한 이메일로 인증 링크를 보냈어!</p>
							<p className="mt-2 mb-6 text-gray-600">이메일을 확인하고 인증을 완료해줘.</p>
							<Button onClick={() => router.push("/login")} className="bg-rose-500 hover:bg-rose-600">
								로그인 페이지로 이동
							</Button>
						</div>
					) : (
						<>
							<h1 className="text-2xl font-extrabold text-rose-600">회원가입</h1>
							<form onSubmit={handleSignUp} className="space-y-4 text-start">
								<div className="space-y-2">
									<label className="text-sm font-medium pl-1">이메일</label>
									<div className="flex gap-2">
										<Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="이메일을 입력해줘" />
										<Button type="button" onClick={checkEmailDuplicate} disabled={isCheckingEmail || !formData.email} className="whitespace-nowrap bg-rose-500 hover:bg-rose-600">
											{isCheckingEmail ? "확인 중..." : "중복 확인"}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium pl-1">비밀번호</label>
									<Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="비밀번호를 입력해줘" minLength={6} />
									<p className="text-xs text-gray-500 pl-1">비밀번호는 최소 6자 이상이어야 해</p>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium pl-1">비밀번호 확인</label>
									<Input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required placeholder="비밀번호를 한 번 더 입력해줘" minLength={6} />
								</div>
								{error && <div className="text-sm text-red-500 text-center font-medium">{error}</div>}
								<Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={loading || !isEmailVerified || !formData.email || !formData.password || !formData.passwordConfirm}>
									{loading ? "회원가입 중..." : "회원가입"}
								</Button>
								<div className="text-center text-sm text-gray-500">
									이미 계정이 있니?{" "}
									<Link href="/login" className="text-rose-600 hover:underline">
										로그인하기
									</Link>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</>
	);
}
