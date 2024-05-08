import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ProviderTanstack from '@/components/ProviderTanstack';
import { ThemeProvider } from '@/components/ThemeProvider';

const jetbrains = JetBrains_Mono({ subsets: ['greek'] });

export const metadata: Metadata = {
	title: 'AI noteing',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<ClerkProvider>
				<ProviderTanstack>
					<body className={jetbrains.className}>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange>
							{children}
						</ThemeProvider>
					</body>
				</ProviderTanstack>
			</ClerkProvider>
		</html>
	);
}
