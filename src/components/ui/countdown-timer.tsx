"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [isExpired, setIsExpired] = useState(false);

	useEffect(() => {
		const targetDate = new Date("2025-09-05T12:00:00");

		const calculateTimeLeft = () => {
			const now = new Date();
			const difference = targetDate.getTime() - now.getTime();

			if (difference > 0) {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
				const minutes = Math.floor((difference / 1000 / 60) % 60);
				const seconds = Math.floor((difference / 1000) % 60);

				setTimeLeft({ days, hours, minutes, seconds });
				setIsExpired(false);
			} else {
				setIsExpired(true);
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex gap-4 justify-center items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
			{isExpired ? (
				<div className="text-2xl font-bold text-rose-500">선물 선택 시간이 종료되었습니다!</div>
			) : (
				<>
					<div className="flex flex-col items-center">
						<span className="text-4xl font-bold">{timeLeft.days}</span>
						<span className="text-sm">일</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-4xl font-bold">{timeLeft.hours}</span>
						<span className="text-sm">시간</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-4xl font-bold">{timeLeft.minutes}</span>
						<span className="text-sm">분</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-4xl font-bold">{timeLeft.seconds}</span>
						<span className="text-sm">초</span>
					</div>
				</>
			)}
		</div>
	);
}
