import React, {createContext, useContext, useState, useEffect} from 'react';
import {useLocation, Navigate} from 'react-router-dom';
import callApi from 'src/utilities/callApi';

// Create a Context for the user info
const UserContext = createContext(null as any);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

function RequireAuth({children}) {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null as any); // Loading state
    const [userInfo, setUserInfo] = useState(null as any); // Store user info

    useEffect(() => {
        // Function to check if the token is valid
        const checkTokenValidity = async () => {
            const authToken = localStorage.getItem('authToken'); // Or use cookies if using them

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
                    setUserInfo(response.data.user); // Store user info
                } else {
                    localStorage.removeItem('authToken'); // Remove invalid token
                    setIsAuthenticated(false); // Token is invalid, set not authenticated
                }
            } catch (error) {
                console.error('Token verification failed:', error.message);
                localStorage.removeItem('authToken'); // Remove token if verification failed
                setIsAuthenticated(false); // Token verification failed, set not authenticated
            }
        };

        checkTokenValidity(); // Call the function to check token validity
    }, []);

    if (isAuthenticated === null) {
        // While checking authentication status, show a loading indicator or nothing
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    // If authenticated, provide user info to children using Context
    return <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>;
}

export default RequireAuth;