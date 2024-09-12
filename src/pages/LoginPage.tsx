import {Card} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {useState} from 'react';
import logo from '../assets/logo512.png';
import TelegramLoginButton from 'src/components/TelegramLoginButton';
import callApi from 'src/utilities/callApi';
import {Navigate, useLocation} from 'react-router-dom';

async function handleTelegramLogin(authData) {
    try {
        const response = await callApi('loginUser', authData);
        console.log('login user', response);

        // Save the token from the server response
        if (!response) return false;
        const {token} = response.data;
        localStorage.setItem('authToken', token); // Alternatively, use cookies
        return true;
    } catch (error) {
        console.error('Authentication failed', error);
        return false;
    }
}

export const LoginPage = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authAttempted, setAuthAttempted] = useState(false); // Track if auth was attempted

    const handleLogin = async (authData) => {
        const valid = await handleTelegramLogin(authData);
        setAuthAttempted(true); // Mark that we've attempted authentication
        setIsAuthenticated(valid); // Update authentication state based on login success
    };

    // If authenticated, navigate to the dashboard
    if (authAttempted && isAuthenticated) {
        return <Navigate to="/dashboard" state={{from: location}} replace />;
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div animate={{y: -40}} transition={{delay: 0.4}}>
                <Card
                    style={{
                        width: 300,
                        height: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        borderRadius: 20,
                        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                    }}
                >
                    <motion.img
                        src={logo}
                        style={{height: '30%'}}
                        animate={{rotate: 120, height: '40%'}}
                    />
                    <motion.div animate={{marginTop: 16}}>
                        <TelegramLoginButton
                            botName={'AurumSkyNetBot'}
                            usePic={false}
                            buttonSize={'large'}
                            dataOnauth={(data) => handleLogin(data)}
                        />
                    </motion.div>
                </Card>
            </motion.div>
            {authAttempted && !isAuthenticated && (
                <div style={{color: 'red', marginTop: 20}}>
                    Authentication failed. Please try again.
                </div>
            )}
        </div>
    );
};
