import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Belfast Backoffice',
  description: 'User profile page',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 