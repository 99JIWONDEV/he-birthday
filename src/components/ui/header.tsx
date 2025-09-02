"use client";

import { ChevronLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
	const router = useRouter();

	return (
		<header className="fixed top-0 left-0 right-0 p-4">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<button onClick={() => router.back()} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="뒤로 가기">
					<ChevronLeft className="w-6 h-6" />
				</button>
				<button onClick={() => router.push("/")} className="transition-colors p-1 rounded-full hover:bg-white/10 flex items-center gap-1">
					<Home className="w-5 h-5" />
				</button>
			</div>
		</header>
	);
}
