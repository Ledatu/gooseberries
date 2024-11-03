import {Button, Card, Checkbox, Icon, Link, Text} from '@gravity-ui/uikit';
import {LogoTelegram, Globe, CircleQuestion} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState} from 'react';
import logo from '../assets/aurum.svg';
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
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    const handleLogin = async (authData) => {
        const valid = await handleTelegramLogin(authData);
        setAuthAttempted(true); // Mark that we've attempted authentication
        setIsAuthenticated(valid); // Update authentication state based on login success
    };

    // If authenticated, navigate to the dashboard
    if (authAttempted && isAuthenticated) {
        return <Navigate to="/" state={{from: location}} replace />;
    }

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div animate={{y: -24}} transition={{delay: 0.5}} style={{y: 100, zIndex: 100}}>
                <Card
                    style={{
                        width: 350,
                        height: 480,
                        overflow: 'hidden',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '#0002 0px 2px 8px 0px',
                        margin: 30,
                        borderRadius: 30,
                        border: '1px solid #eee2',
                        position: 'relative',
                        background: '#2d2c33',
                    }}
                >
                    <motion.img
                        src={logo}
                        style={{height: '30%'}}
                        animate={{rotate: 120, height: '40%', marginTop: '20%'}}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            backdropFilter: 'blur(20px)',
                            height: 83,
                            width: '100%',
                            bottom: 0,
                            paddingBottom: 24,
                            zIndex: 1000,
                        }}
                    >
                        <Checkbox
                            size="l"
                            checked={privacyPolicyAccepted}
                            onUpdate={(val) => setPrivacyPolicyAccepted(val)}
                        />
                        <div style={{minWidth: 16}} />
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Text>Я подтверждаю, что ознакомился(-ась) </Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Text>с</Text>
                                <div style={{minWidth: 4}} />
                                <Link href="https://aurum-mp.ru/offer.pdf" target="_blank">
                                    условиями публичной оферты
                                </Link>
                                <div style={{minWidth: 4}} />
                                <Text>и</Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Link href="https://aurum-mp.ru/privacy_policy.pdf" target="_blank">
                                    политикой конфиденциальности
                                </Link>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        animate={{
                            marginTop: 16,
                            marginBottom: privacyPolicyAccepted ? 130 : 0,
                            opacity: privacyPolicyAccepted ? 1 : 0,
                            display: privacyPolicyAccepted ? 'block' : 'block',
                        }}
                        transition={{ease: 'anticipate', duration: 0.6}}
                        style={{overflow: 'hidden', opacity: 0, margin: 0}}
                    >
                        <TelegramLoginButton
                            botName={'AurumSkyNetBot'}
                            usePic={false}
                            buttonSize={'large'}
                            dataOnauth={(data) => {
                                if (privacyPolicyAccepted) handleLogin(data);
                            }}
                        />
                    </motion.div>
                </Card>
            </motion.div>
            {authAttempted && !isAuthenticated && (
                <div style={{color: 'red', marginTop: 20}}>
                    Authentication failed. Please try again.
                </div>
            )}
            <motion.div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // marginBottom: 24,
                    y: -28,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        size="l"
                        pin="circle-circle"
                        target="_blank"
                        href="https://t.me/+bB-iFYd4uDUyZDVi"
                    >
                        <Icon data={LogoTelegram} />
                        Наш телеграм
                    </Button>
                    <div style={{minWidth: 16}} />
                    <Button
                        size="l"
                        pin="circle-circle"
                        target="_blank"
                        href="https://aurum-sky.net"
                    >
                        <Icon data={Globe} />
                        Наш сайт
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 16,
                    }}
                >
                    <Button
                        size="l"
                        pin="circle-circle"
                        target="_blank"
                        href="https://t.me/AurumSkyNetSupportBot"
                    >
                        <Icon data={CircleQuestion} />
                        Поддержка
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
