'use client';

import {createContext, useContext, useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {LogoLoader} from '@/components/LogoLoader/LogoLoader';
import ApiClient from '@/utilities/ApiClient';

// Create a Context for the user info
const UserContext = createContext(null as any);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

export function RequireAuth({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    // useEffect(() => {
    //     console.log("huihuijui")
    // })

    const checkTokenValidity = async () => {
        const authToken = localStorage.getItem('authToken');
        console.log('userInfo', JSON.stringify(userInfo));
        console.log('authtoken',!authToken);
        if (!authToken) {
            setIsAuthenticated(false);
            console.log('isAuthentcated', isAuthenticated);
            return;
        }

        try {
            const response = await ApiClient.post('auth/verify-token', {token: authToken});
            console.log('response', response);
            console.log('userInfo', JSON.stringify(userInfo));

            if (response?.data?.valid) {
                setIsAuthenticated(true);
                console.log(response?.data?.campaigns);
                if (JSON.stringify(userInfo) !== JSON.stringify(response.data)) {
                    setUserInfo({
                        ...response.data,
                        campaigns: response?.data?.campaigns || [], // Ensure campaigns array exists
                    });

                    console.log('userInfo', userInfo);
                }
            } else {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
            }
        } catch (error: any) {
            console.error('Token verification failed:', error.message);
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkTokenValidity();
    }, []);

    const refetchUser = async () => {
        await checkTokenValidity();
    };

    useEffect(() => {
        const interval = setInterval(refetchUser, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isAuthenticated === false) {
            console.log(isAuthenticated, 'akdjaslkdjkaj');
            
            // window.history.replaceState(null, '', '/login');
            router.push('/login');
        }
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <LogoLoader />
            </div>
        );
    }

    return (
        <UserContext.Provider value={{userInfo, refetchUser, isAuthenticated}}>
            {children}
        </UserContext.Provider>
    );
}
