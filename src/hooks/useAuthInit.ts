import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRefreshAccessToken } from '@/api/authApi';
import { useUserStore } from '@/store/useUserStore';
import { getMyProfile } from '@/api/userApi';

export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { accessToken, isInitialized, setAccessToken } = useAuthStore();
  const { setUser } = useUserStore();
  const { refresh } = useRefreshAccessToken();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isInitialized) return;

        // If we have a token but no user data, try to fetch the user
        if (accessToken) {
          try {
            const user = await getMyProfile();
            setUser(user);
          } catch (error) {
            // If token is invalid, try to refresh it
            try {
              await refresh();
              const user = await getMyProfile();
              setUser(user);
            } catch (refreshError) {
              // If refresh fails, clear the token
              setAccessToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [accessToken, isInitialized, refresh, setAccessToken, setUser]);

  return { isInitializing };
};
