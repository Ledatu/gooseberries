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
                        // transition={{duration: 0.2}}
                    />
                    <motion.div animate={{marginTop: 16}}>
                        <TelegramLoginButton
                            botName={'AurumSkyNetBot'}
                            usePic={false}
                            buttonSize={'large'}
                            dataOnauth={(data) => {
                                console.log(data);
                            }}
                        />
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};
