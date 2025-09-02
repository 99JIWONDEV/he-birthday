"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserGift {
	email: string;
	selectedGift: string;
}

interface SupabaseUser {
	id: string;
	email?: string;
}

const GIFT_MAP: { [key: string]: string } = {
	"1": "백팩",
	"2": "스탠드오일 가방",
	"3": "조말론 향수",
	"4": "라부부 인형",
	"5": "렉슨 조명",
	"6": "케이스티파이 케이스",
};

export default function AdminPage() {
	const [userGifts, setUserGifts] = useState<UserGift[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchUserGifts();
	}, []);

	const fetchUserGifts = async () => {
		try {
			// 선물 선택 정보와 사용자 ID를 함께 가져오기
			const { data: selectedGifts, error: giftError } = await supabase.from("selected_gifts").select("user_id, gift_id, custom_description");

			if (giftError) {
				console.error("Gift error:", giftError);
				throw giftError;
			}

			// 사용자 정보를 가져와서 이메일과 매핑
			const usersResponse = await fetch("/api/admin/users");
			if (!usersResponse.ok) {
				throw new Error("사용자 정보를 가져오는데 실패했습니다.");
			}
			const { users } = await usersResponse.json();

			// 데이터 매핑
			const mappedData: UserGift[] =
				selectedGifts?.map((gift) => {
					let giftName = "-";

					if (gift.gift_id === "custom") {
						giftName = `직접 입력: ${gift.custom_description}`;
					} else {
						giftName = GIFT_MAP[gift.gift_id] || "-";
					}

					// 사용자 ID로 이메일 찾기
					const user = users?.find((u: SupabaseUser) => u.id === gift.user_id);
					const email = user?.email || "-";

					return {
						email: email,
						selectedGift: giftName,
					};
				}) || [];

			setUserGifts(mappedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div className="p-8 text-center">로딩 중...</div>;

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-2xl font-bold mb-6">사용자 선물 선택 현황</h1>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">선택한 선물</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{userGifts.map((user, index) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.selectedGift}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
