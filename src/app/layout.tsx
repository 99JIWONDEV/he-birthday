import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "하은 생일 선물",
	description: "하은이를 위한 하은이만을 위한 페이지",
	icons: {
		icon: [
			{
				url: "/favicon.svg",
				type: "image/svg+xml",
			},
		],
	},
	openGraph: {
		title: "하은 생일 선물",
		description: "하은이를 위한 하은이만을 위한 페이지",
		images: [
			{
				url: "/mainImg.jpg",
				width: 1200,
				height: 630,
				alt: "하은 생일 선물",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "하은 생일 선물",
		description: "하은이를 위한 하은이만을 위한 페이지",
		images: ["/mainImg.jpg"],
	},
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
