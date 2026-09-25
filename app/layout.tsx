import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Pulse — Marketing analytics', description: 'A clearer picture of your growth. Interactive marketing analytics demo.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html> }
