// loginHandler.tsx
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import callApi from 'src/utilities/callApi';
import {useError} from './ErrorContext';

// Utility function to handle Telegram login and save the auth token
async function handleTelegramLogin(authData) {
    try {
        const response = await callApi('loginUser', authData);
        if (response && response.data.token) {
            localStorage.setItem('authToken', response.data.token);
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
        // Function to extract auth data from URL
        const extractAuthData = () => {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                id: urlParams.get('id'),
                first_name: urlParams.get('first_name'),
                username: urlParams.get('username'),
                auth_date: urlParams.get('auth_date'),
                hash: urlParams.get('hash'),
            };
        };

        // Function to authenticate and redirect
        const authenticateAndRedirect = async () => {
            const authData = extractAuthData();

            // Check if essential auth data is present
            if (!authData.id || !authData.hash) {
                console.error('Missing authentication data:', authData);
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
