import {Card} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React from 'react';
import logo from '../assets/logo512.png';
import TelegramLoginButton from 'src/components/TelegramLoginButton';

export const LoginPage = () => {
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
            <motion.div>
                <Card
                    style={{
                        width: 400,
                        height: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                    }}
                >
                    <img src={logo} style={{height: '40%'}} />
                    <TelegramLoginButton
                        botName={'AurumSkyNetBot'}
                        usePic={false}
                        buttonSize={'large'}
                        dataOnauth={(data) => {
                            console.log(data);
                        }}
                    />
                </Card>
            </motion.div>
        </div>
    );
};
