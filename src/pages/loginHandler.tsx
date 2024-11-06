// loginHandler.tsx
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import callApi from 'src/utilities/callApi';
import {useError} from './ErrorContext';

// Function to verify and send Telegram authentication data to the server
async function handleTelegramLogin(authData) {
    try {
        // Send authData to the server for validation and token generation
        const response = await callApi('loginUser', authData);
        if (response && response.data.token) {
            localStorage.setItem('authToken', response.data.token); // Store JWT token
            return true;
        }
        return false;
    } catch (error) {
        console.error('Authentication failed:', error);
        return false;
    }
}

const LoginHandler = () => {
    const navigate = useNavigate();
    const {showError} = useError();

    useEffect(() => {
        // Function to capture all required auth data from URL parameters
        const extractAuthData = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const authData = {};

            // Iterate over each URL parameter and add it to authData
            urlParams.forEach((value, key) => {
                authData[key] = key === 'auth_date' ? parseInt(value, 10) : value; // Convert `auth_date` to an integer
            });

            return authData;
        };

        // Authenticate and redirect user if login is successful
        const authenticateAndRedirect = async () => {
            const authData = extractAuthData();

            // Check for essential auth data
            if (!authData?.['id'] || !authData?.['hash'] || !authData?.['auth_date']) {
                console.error('Missing essential authentication data:', authData);
                showError('Authentication failed. Missing data.');
                navigate('/login');
                return;
            }

            const isAuthenticated = await handleTelegramLogin(authData);

            if (isAuthenticated) {
                navigate('/'); // Redirect to the main page/dashboard on successful login
            } else {
                showError('Authentication failed. Please try again.');
                navigate('/login'); // Redirect back to login page on failure
            }
        };

        authenticateAndRedirect();
    }, [navigate, showError]);

    return <div>Redirecting...</div>;
};

export default LoginHandler;
