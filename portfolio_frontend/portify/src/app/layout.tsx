import "@/styles/globals.css";
import type { Metadata } from "next";
import { UIProvider } from "@/providers/UIProvider";
import Navbar from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";

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
				<UIProvider>
					<Navbar />
						{children}
					<Footer />
				</UIProvider>
			</body>
		</html>
	);
}
