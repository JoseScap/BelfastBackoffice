import { Outfit } from 'next/font/google';
import './globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { TRPCProvider } from '@/api/trpc/provider';
import BackendConnectionStatus from '@/components/common/BackendConnectionStatus';

const outfit = Outfit({
  variable: '--font-outfit-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              <TRPCProvider>
                {children}
                <BackendConnectionStatus />
                <Toaster position="bottom-right" />
              </TRPCProvider>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
