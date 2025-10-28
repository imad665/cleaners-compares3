'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function ReturnToAdminButton() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<{ email: string; password: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if admin is currently impersonating a seller
  useEffect(() => {
    // Check localStorage for impersonation flag and stored admin credentials
    const impersonating = localStorage.getItem('isImpersonating');
    const storedEmail = localStorage.getItem('adminEmail');
    const storedPassword = '123456789'; // Hardcoded password - consider security implications
    
    setIsImpersonating(impersonating === 'true');
    
    if (storedEmail) {
      setAdminCredentials({
        email: storedEmail,
        password: '123456789' // Use your actual admin password here
      });
    }
  }, []);

  const handleReturnToAdmin = async () => {
    if (!adminCredentials) {
      console.error('Admin credentials not found');
      return;
    }

    setIsLoading(true);

    try {
      // Clear impersonation data FIRST
      localStorage.removeItem('isImpersonating');
      localStorage.removeItem('impersonatedSellerId');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('impersonatedSellerName');

      // Sign in with the original admin credentials and redirect to /admin
      const result = await signIn('credentials', {
        email: adminCredentials.email,
        password: "123456789",/* adminCredentials.password, */
        redirect: true,
        callbackUrl: '/admin/userManagement' // This will redirect to /admin after successful signin
      });

      if (result?.error) {
        console.error('Failed to sign back in as admin:', result.error);
        // Fallback: redirect to login page
        router.push('/auth/signin');
        return;
      }

      // The redirect: true will handle the navigation to /admin
      // No need for additional redirects here
      
    } catch (error) {
      console.error('Error returning to admin:', error);
      // Fallback: redirect to login page
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show the button if admin is impersonating a seller
  if (!isImpersonating) {
    return null;
  }

  return ( 
    <Button
      onClick={handleReturnToAdmin}
      disabled={isLoading}
      className="fixed cursor-pointer bottom-4 p-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 hover:bg-red-700 text-white shadow-lg px-6 py-3"
      size="sm"
    >
      <Shield className="w-4 h-4 mr-2" />
      {isLoading ? 'Returning...' : 'Back to Super Admin'}
      <LogOut className="w-4 h-4 ml-2" />
    </Button>
  );
}