import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {useLocation, Navigate} from 'react-router-dom';
import callApi from 'src/utilities/callApi';
import {LogoLoader} from './LogoLoader';

// Create a Context for the user info
const UserContext = createContext(null as any);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

function RequireAuth({children}) {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null as any); // Loading state
    const [userInfo, setUserInfo] = useState(null as any); // Store user info

    const checkTokenValidity = useCallback(async () => {
        // const authToken = localStorage.getItem('authToken');
        const authToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMzODM5MTU3LCJ1c2VybmFtZSI6IkxlZGF0dSIsImlhdCI6MTcyNjExMzIxNSwiZXhwIjoxNzI4NzA1MjE1fQ.5tKHpRdpoAZhxavorx2ofX_h-Du7iyYkClsCIPQz78Q';

        if (!authToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            // Call the backend API to verify the token and get user info
            const response = await callApi('verifyToken', {token: authToken});
            if (!response) throw new Error('error occurred');

            console.log('verifyToken', response);

            if (response.data.valid) {
                setIsAuthenticated(true); // Token is valid, set authenticated
                setUserInfo(response.data); // Store user info
            } else {
                localStorage.removeItem('authToken'); // Remove invalid token
                setIsAuthenticated(false); // Token is invalid, set not authenticated
            }
        } catch (error) {
            console.error('Token verification failed:', error.message);
            localStorage.removeItem('authToken'); // Remove token if verification failed
            setIsAuthenticated(false); // Token verification failed, set not authenticated
        }
    }, []); // Empty dependency array, so it is only created once
    // Effect to check token validity on mount
    useEffect(() => {
        checkTokenValidity(); // Call the function to check token validity
    }, [checkTokenValidity]);

    // Refetch function to reload user data
    const refetchUser = async () => {
        await checkTokenValidity(); // Reuse the token checking logic
    };

    if (isAuthenticated === null) {
        // While checking authentication status, show a loading indicator or nothing
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

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    // If authenticated, provide user info and refetch function to children using Context
    return <UserContext.Provider value={{userInfo, refetchUser}}>{children}</UserContext.Provider>;
}

export default RequireAuth;
