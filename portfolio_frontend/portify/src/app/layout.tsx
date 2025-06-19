import "@/styles/globals.css";
import type { Metadata } from "next";
import { HeroUIProvider } from '@heroui/react'

export const metadata: Metadata = {
	title: "Portify",
	description: "Created by Mehrulloh Boboev",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-900">
				<HeroUIProvider>
					{children}
				</HeroUIProvider>
			</body>
		</html>
	);
}
