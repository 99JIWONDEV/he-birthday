"use client";

import Image from "next/image";
import LinkButton from "@/components/ui/link-button";
import mainImg from "@/assets/main/mainImg.jpg";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

const ReactConfetti = dynamic(() => import("react-confetti"), {
	ssr: false,
});

export default function Home() {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [isConfettiActive, setIsConfettiActive] = useState(true);

	useEffect(() => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		const timer = setTimeout(() => {
			setIsConfettiActive(false);
		}, 12000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center">
			{isConfettiActive && <ReactConfetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} recycle={false} colors={["#ff0000", "#ffd700", "#ff69b4", "#00ff00", "#ff4500"]} />}
			<div className="container mx-auto px-4 text-center flex flex-col gap-4 relative mt-10">
				<h1 className="text-4xl font-extrabold text-rose-600">하은아 생일축하해 🎉</h1>
				<p className="text-gray-600 font-bold">
					어느새 우리가 만난지 일년이 되어가고 <br />
					우리 하은이의 생일이 되었네!
				</p>
				<Image src={mainImg} alt="birthday" width={300} height={300} className="mx-auto rounded-lg shadow-lg" />
				<p className="text-gray-600 text-xs font-medium -mt-2">(너랑 똑같이 생긴 애더라고...)</p>
				<div className="space-y-4">
					<LinkButton href="/memories" className="mt-4">
						다음
					</LinkButton>
				</div>
				<Link href="/login" className="text-sm text-gray-500 hover:text-rose-500 underline -mt-2">
					바로 로그인하러가기
				</Link>
			</div>
		</div>
	);
}
