import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "생일 선물 고르기",
	description: "특별한 생일 선물을 골라보세요",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={inter.className}>
				<main className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
