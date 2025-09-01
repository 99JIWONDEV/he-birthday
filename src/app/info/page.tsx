"use client";

import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const messages = ["이 사이트는 2025년 하은이의<br />생일 선물을 고르기 위한 사이트야", "하은이는 로그인을 해주고<br />갖고 싶은 생일 선물을 고르면 돼.", "그럼 오빠가 최고의 선물을 준비해줄게", "그럼 시작해볼까?"];

export default function InfoPage() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showMessage, setShowMessage] = useState(true);
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		if (currentIndex >= messages.length) return;

		const timer = setInterval(() => {
			setShowMessage(false);
			setTimeout(() => {
				if (currentIndex === messages.length - 1) {
					setShowButton(true);
					return;
				}
				setCurrentIndex((prev) => prev + 1);
				setShowMessage(true);
			}, 500); // 페이드 아웃 후 다음 메시지로
		}, 3000);

		return () => clearInterval(timer);
	}, [currentIndex]);
	return (
		<div className="min-h-screen flex items-center justify-center">
			<Header />
			<div className="container mx-auto px-4 text-center flex flex-col relative">
				<div className="h-20 flex items-center justify-center">
					<div className={`text-lg font-medium transition-opacity duration-500 ${showMessage ? "opacity-100" : "opacity-0"}`} dangerouslySetInnerHTML={{ __html: messages[currentIndex] }} />
				</div>
				{showButton && (
					<div className="h-20 flex items-center justify-center -mt-16">
						<Link href="/login" className="animate-pulse-scale inline-flex items-center gap-1 text-rose-600 text-lg font-medium hover:text-rose-700 relative group">
							<span className="relative">
								로그인 하러 가기
								<span className="absolute left-0 right-0 bottom-0 h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
							</span>
							<ChevronRight className="w-5 h-5" />
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
