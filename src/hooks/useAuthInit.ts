import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { getMyProfile } from '@/api/userApi';
import { refreshAccessToken } from '@/api/authApi';

interface ApiError {
  message: string;
  status?: number;
}

export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const { accessToken, setAccessToken, setInitialized } = useAuthStore();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // If we have an access token, verify it's still valid by fetching profile
        if (accessToken) {
          try {
            const user = await getMyProfile();
            if (isMounted) {
              setUser(user);
              setError(null);
            }
          } catch (error) {
            // Token might be invalid, let axios interceptor handle refresh
            console.log('Token validation failed, will be handled by axios interceptor');
            if (isMounted) {
              clearUser();
              setAccessToken(null);
            }
          }
        } else {
          // No access token, try to refresh from cookies
          try {
            const response = await refreshAccessToken();
            const token = response.data.accessToken;
            
            if (token && isMounted) {
              setAccessToken(token);
              const user = await getMyProfile();
              setUser(user);
              setError(null);
            }
          } catch (refreshError) {
            // No valid refresh token, user is not logged in
            console.log('No valid session found');
            if (isMounted) {
              clearUser();
              setAccessToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setError({
            message: error instanceof Error ? error.message : 'Authentication failed',
            status: 500,
          });
          
          // Clear any invalid auth state
          setAccessToken(null);
          clearUser();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Remove accessToken from deps to prevent infinite loops

  return { 
    isInitializing, 
    error,
    retry: () => {
      setIsInitializing(true);
      setError(null);
    }
  };
};
