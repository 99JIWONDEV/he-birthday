"use client";

import Link from "next/link";
import { ReactNode } from "react";


interface LinkButtonProps {
	href: string;
	children: ReactNode;
	className?: string;
	variant?: "default" | "outline" | "ghost";
}

export default function LinkButton({ href, children, className = "", variant = "default" }: LinkButtonProps) {
	const baseStyles = "block w-full py-3 px-4 rounded-lg transition-all text-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantStyles = {
		default: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
		outline: "border-2 border-rose-500 text-rose-500 hover:bg-rose-50 focus:ring-rose-500",
		ghost: "text-rose-500 hover:bg-rose-50 focus:ring-rose-500",
	};

	return (
		<Link href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
			{children}
		</Link>
	);
}
