"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import memory1Img from "@/assets/memories/m1.png";
import memory2Img from "@/assets/memories/m2.png";
import memory3Img from "@/assets/memories/m3.png";
import memory4Img from "@/assets/memories/m4.png";
import memory5Img from "@/assets/memories/m5.png";
import LinkButton from "@/components/ui/link-button";
import Header from "@/components/ui/header";

const memories = [
	{
		id: 1,
		image: memory1Img,
		description: "졸업 축하해줘서 고마워 🎓",
	},
	{
		id: 2,
		image: memory2Img,
		description: "우리에게는 승리뿐이다 ⚽️",
	},
	{
		id: 3,
		image: memory3Img,
		description: "우리의 300일 🎉",
	},
	{
		id: 4,
		image: memory4Img,
		description: "우리 제법 잘 어울려요 🤭",
	},
	{
		id: 5,
		image: memory5Img,
		description: "이건 하은이가 까먹은 오빠 생일 🤬",
	},
];

export default function MemoriesPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<Header />
			<div className="container mx-auto px-4 text-center flex flex-col gap-4 relative">
				<h1 className="text-2xl font-extrabold text-rose-600">우리의 추억이야 📸</h1>
				<p className="text-gray-600 text-sm -mt-3">옆으로 넘겨봐!</p>
				<Carousel className="w-full max-w-xl mx-auto">
					<CarouselContent>
						{memories.map((memory) => (
							<CarouselItem key={memory.id}>
								<div className="p-1">
									<div className="overflow-hidden rounded-xl">
										<Image src={memory.image} alt={memory.description} width={400} height={500} className="object-cover w-full" />
									</div>
									<p className="mt-4 text-gray-700">{memory.description}</p>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="left-2" />
					<CarouselNext className="right-2" />
				</Carousel>
				<div className="space-y-4">
					<LinkButton href="/info" className="mt-4">
						다음
					</LinkButton>
				</div>
			</div>
		</div>
	);
}
