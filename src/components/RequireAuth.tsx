import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
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
    // const [userInfo, setUserInfo] = useState({
    //     valid: true,
    //     user: {
    //         _id: 933839157,
    //         first_name: 'Данила',
    //         username: 'Ledatu',
    //         photo_url: 'https://t.me/i/userpic/320/J7y4AiRca6o1a3L1GSrHlBfhznJPXnWqFh8zJKdpaqE.jpg',
    //         __v: 0,
    //     },
    //     campaigns: [
    //         {
    //             _id: '66e2fe0c31666f89d3df0f17',
    //             seller_id: '0f9c9368-1b08-40ed-b4ad-47524a0afb2d',
    //             owner_id: 933839157,
    //             name: 'ИП Валерий',
    //             memberDetails: [
    //                 {
    //                     _id: 933839157,
    //                     first_name: 'Данила',
    //                     username: 'Ledatu',
    //                     photo_url:
    //                         'https://t.me/i/userpic/320/J7y4AiRca6o1a3L1GSrHlBfhznJPXnWqFh8zJKdpaqE.jpg',
    //                     __v: 0,
    //                 },
    //                 {
    //                     _id: 566810027,
    //                     __v: 0,
    //                     first_name: 'Кирилл',
    //                     photo_url:
    //                         'https://t.me/i/userpic/320/S3qklarHi9krJwMntSI2sxLbqhEsMk5NWrXRUrtZNBU.jpg',
    //                     username: 'ilovedilucsomuch',
    //                 },
    //             ],
    //             isOwner: true,
    //             userModules: [],
    //         },
    //         {
    //             _id: '66e2ff0bc9150e871c76f724',
    //             seller_id: 'e8d8163c-d66f-4f63-9841-151bb133d5ec',
    //             owner_id: 933839157,
    //             name: 'Текстиль',
    //             memberDetails: [
    //                 {
    //                     _id: 933839157,
    //                     first_name: 'Данила',
    //                     username: 'Ledatu',
    //                     photo_url:
    //                         'https://t.me/i/userpic/320/J7y4AiRca6o1a3L1GSrHlBfhznJPXnWqFh8zJKdpaqE.jpg',
    //                     __v: 0,
    //                 },
    //                 {
    //                     _id: 566810027,
    //                     __v: 0,
    //                     first_name: 'Кирилл',
    //                     photo_url:
    //                         'https://t.me/i/userpic/320/S3qklarHi9krJwMntSI2sxLbqhEsMk5NWrXRUrtZNBU.jpg',
    //                     username: 'ilovedilucsomuch',
    //                 },
    //             ],
    //             isOwner: true,
    //             userModules: [],
    //         },
    //     ],
    // }); // Store user info

    const checkTokenValidity = useCallback(async () => {
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
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    // If authenticated, provide user info and refetch function to children using Context
    return <UserContext.Provider value={{userInfo, refetchUser}}>{children}</UserContext.Provider>;
}

export default RequireAuth;
