"use client";

import { ChevronLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
	const router = useRouter();

	return (
		<header className="w-full p-2 relative z-10">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<button onClick={() => router.back()} className="p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="뒤로 가기" type="button">
					<ChevronLeft className="w-6 h-6" />
				</button>
				<button onClick={() => router.push("/")} className="p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1" type="button">
					<Home className="w-5 h-5" />
				</button>
			</div>
		</header>
	);
}
