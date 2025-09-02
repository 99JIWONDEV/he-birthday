"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/ui/countdown-timer";
import Image, { StaticImageData } from "next/image";

import bag from "@/assets/gifts/bag.png";
import bag2 from "@/assets/gifts/bag2.png";
import jomalon from "@/assets/gifts/jomalon.png";
import labobo from "@/assets/gifts/labobo.png";
import lexon from "@/assets/gifts/lexon.png";
import caseImg from "@/assets/gifts/case.png";
import Header from "@/components/ui/header";

interface Gift {
	id: string;
	title: string;
	description: string;
	image_url: StaticImageData;
	url: string;
}

// 프론트엔드에서 관리할 선물 목록
const GIFT_LIST: Gift[] = [
	{
		id: "1",
		title: "백팩",
		description: "하은이 스타일의 가방을 찾아서 알려줘!",
		image_url: bag,
		url: "https://www.musinsa.com/search/goods?keyword=%EC%97%AC%EC%9E%90%EB%B0%B1%ED%8C%A9&gf=A",
	},
	{
		id: "2",
		title: "스탠드오일 가방",
		description: "옆으로 매는 작은 가방 있으면 좋을 것 같아서!",
		image_url: bag2,
		url: "https://standoil.kr/product/list.html?cate_no=405",
	},
	{
		id: "3",
		title: "조말론 향수",
		description: "같이 맡아보고 사는걸로! 조말론 아니어도 돼!",
		image_url: jomalon,
		url: "https://www.jomalone.co.kr/colognes/30ml-colognes",
	},
	{
		id: "4",
		title: "라부부 인형",
		description: "혹시 몰라서 넣어놨어",
		image_url: labobo,
		url: "https://kream.co.kr/search?keyword=%EB%9D%BC%EB%B6%80%EB%B6%80&srsltid=AfmBOoq0_H8WslR9bF3LU3XLo02EjaV0VQ68im-f4IJSc-AHoMXQX0ld&tmp=1756733542001",
	},
	{
		id: "5",
		title: "렉슨 조명",
		description: "집들이 선물 1위 조명, 오빠도 써",
		image_url: lexon,
		url: "https://www.29cm.co.kr/products/771288",
	},
	{
		id: "6",
		title: "케이스티파이 케이스",
		description: "혹시 핸드폰 케이스를 바꾸고 싶다면?",
		image_url: caseImg,
		url: "https://www.casetify.com/iphone-cases?DG=iPhone&nbt=nb%3Aadwords%3Ag%3A18222233018%3A146434907891%3A712810406373&nb_placement=&utm_source=google&utm_campaign=202105_MOFU_SN_Evergreen_KR_Brand_KOR&utm_medium=cpc&utm_term=%EC%BC%80%EC%9D%B4%EC%8A%A4+%ED%8B%B0%ED%8C%8C%EC%9D%B4",
	},
];

export default function GiftsPage() {
	const [gifts, setGifts] = useState<Gift[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
	const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
	const [customGift, setCustomGift] = useState("");

	useEffect(() => {
		const initializeData = async () => {
			try {
				setLoading(true);
				// 먼저 사용자 정보와 선택된 선물 정보를 가져옴
				await fetchUserProfile();
				const hasSelectedGift = await checkSelectedGift();

				// 선택된 선물이 없을 때만 전체 선물 목록을 가져옴
				if (!hasSelectedGift) {
					await fetchGifts();
				}
			} finally {
				setLoading(false);
			}
		};

		initializeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchUserProfile = async () => {
		try {
			const {
				data: { user: _user },
				error,
			} = await supabase.auth.getUser();
			if (error) throw error;
		} catch (err) {
			console.error("사용자 정보 가져오기 실패:", err instanceof Error ? err.message : err);
		}
	};

	const fetchGifts = () => {
		setGifts(GIFT_LIST);
	};

	const checkSelectedGift = async () => {
		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError) throw userError;

			if (!user) {
				fetchGifts();
				return false;
			}

			// 현재 사용자의 선택 정보를 가져옴
			const { data: selectedData, error: selectedError } = await supabase.from("selected_gifts").select("*").eq("user_id", user.id).maybeSingle();

			if (selectedError) {
				fetchGifts();
				return false;
			}

			if (selectedData) {
				// 선택된 선물 정보를 프론트엔드 데이터에서 찾기
				const selectedGift = GIFT_LIST.find((gift) => gift.id === selectedData.gift_id);
				if (selectedGift) {
					setSelectedGiftId(selectedData.gift_id);
					setSelectedGift(selectedGift);
					return true;
				}
			}

			fetchGifts();
			return false;
		} catch (err) {
			console.error("선택된 선물 확인 중 오류:", err instanceof Error ? err.message : err);
			fetchGifts();
			return false;
		}
	};

	const handleSelectGift = async (giftId: string, customDescription?: string) => {
		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError) throw userError;
			if (!user) throw new Error("로그인이 필요합니다.");

			// 기존 선택이 있다면 먼저 삭제
			const { error: deleteError } = await supabase.from("selected_gifts").delete().eq("user_id", user.id);
			if (deleteError) throw deleteError;

			// 새로운 선택 추가
			const insertData = {
				gift_id: giftId,
				user_id: user.id,
				custom_description: customDescription,
			};

			const { error: insertError } = await supabase.from("selected_gifts").insert([insertData]);
			if (insertError) throw insertError;

			if (giftId === "custom") {
				setSelectedGiftId("custom");
				setSelectedGift({
					id: "custom",
					title: "직접 입력한 선물",
					description: customDescription || "",
					image_url: caseImg,
					url: "#",
				});
			} else {
				// 선택한 선물 정보를 프론트엔드 데이터에서 찾기
				const selectedGift = GIFT_LIST.find((gift) => gift.id === giftId);
				if (selectedGift) {
					setSelectedGiftId(giftId);
					setSelectedGift(selectedGift);
				}
			}
		} catch (err) {
			console.error("선물 선택 중 오류:", err instanceof Error ? err.message : err);
		}
	};

	const resetGiftSelection = async () => {
		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError) throw userError;
			if (!user) throw new Error("로그인이 필요합니다.");

			// 현재 사용자의 선택된 선물을 모두 삭제
			const { error } = await supabase.from("selected_gifts").delete().eq("user_id", user.id);

			if (error) throw error;
			setSelectedGiftId(null);
			setSelectedGift(null);
			fetchGifts();
		} catch (err) {
			console.error("선물 선택 초기화 중 오류:", err instanceof Error ? err.message : err);
		}
	};

	if (loading) return <div className="text-center p-8">로딩 중...</div>;

	return (
		<div className="container mx-auto px-4 pt-4 pb-14">
			<Header />
			<div className="text-center mb-8 mt-10">
				<h1 className="text-3xl font-bold text-rose-600">하은 선물 리스트</h1>
				<p className="mt-2 text-gray-600">9월 5일까지 원하는 선물을 선택해줘!</p>
				<p className="text-gray-600">선물은 9월 5일 전까지 변경할 수 있어!</p>
				<div className="mt-2">
					<CountdownTimer />
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<p className="text-gray-600 text-xs text-center -mb-10">카드를 클릭하면 상세페이지로 이동해</p>
				{selectedGift ? (
					<Card key={selectedGift.id} className="overflow-hidden rounded-xl">
						{selectedGift.id === "custom" ? (
							<div className="p-6">
								<h3 className="text-xl font-bold mb-4">{selectedGift.title}</h3>
								<div className="bg-gray-50 p-4 rounded-lg mb-4">
									<p className="text-gray-700 whitespace-pre-wrap">{selectedGift.description}</p>
								</div>
								<Button disabled className="w-full bg-green-500">
									내가 입력한 선물
								</Button>
							</div>
						) : (
							<a href={selectedGift.url} target="_blank" rel="noopener noreferrer" className="block">
								<div className="relative w-full h-48 rounded-t-xl overflow-hidden">
									<Image src={selectedGift.image_url} alt={selectedGift.title} fill className="object-contain rounded-t-xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
								</div>
								<CardHeader>
									<CardTitle className="flex justify-between items-center mt-6">
										<span>{selectedGift.title}</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 mt-2">{selectedGift.description}</p>
									<Button disabled className="w-full bg-green-500 mt-4">
										내가 선택한 선물
									</Button>
								</CardContent>
							</a>
						)}
					</Card>
				) : (
					[
						...gifts,
						{
							id: "custom",
							title: "직접 입력하기",
							description: "원하는 선물이 없다면 여기에 적어줘!",
							image_url: caseImg, // 임시로 기존 이미지 사용
							url: "#",
						},
					].map((gift) => (
						<div key={gift.id}>
							<Card className="overflow-hidden rounded-xl">
								<div>
									{gift.id === "custom" ? (
										<div>
											<CardTitle className="px-4">
												<p>직접 원하는 선물 적기</p>
											</CardTitle>
											<div className="p-4">
												<textarea value={customGift} onChange={(e) => setCustomGift(e.target.value)} placeholder="원하는 선물을 자유롭게 적어줘!" className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-rose-500" />
											</div>
										</div>
									) : (
										<a href={gift.url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-102">
											{gift.image_url && (
												<div className="relative w-full h-48 rounded-t-xl overflow-hidden">
													<Image src={gift.image_url} alt={gift.title} fill className="object-contain rounded-xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
												</div>
											)}
											<CardHeader>
												<CardTitle className="flex justify-between items-center mt-6">
													<span>{gift.title}</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-gray-600 mt-2">{gift.description}</p>
											</CardContent>
										</a>
									)}
								</div>
								<CardContent className="pt-0">
									<Button onClick={() => (gift.id === "custom" ? handleSelectGift("custom", customGift) : handleSelectGift(gift.id))} className="w-full bg-rose-500 hover:bg-rose-600 mt-3" disabled={gift.id === "custom" && !customGift.trim()}>
										이 선물로 할게!
									</Button>
								</CardContent>
							</Card>
						</div>
					))
				)}
			</div>
			{selectedGiftId && (
				<div className="text-center mt-8">
					<Button onClick={resetGiftSelection} variant="outline" className="bg-white text-rose-600 border-rose-600 hover:bg-rose-50">
						선물 다시 고르기
					</Button>
				</div>
			)}
		</div>
	);
}
