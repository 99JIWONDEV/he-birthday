"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
	const router = useRouter();

	return (
		<header className="fixed top-0 left-0 right-0 p-4">
			<button onClick={() => router.back()} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="뒤로 가기">
				<ChevronLeft className="w-6 h-6" />
			</button>
		</header>
	);
}
