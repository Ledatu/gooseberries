// LoginPage.tsx
'use client';
import {Button, Card, Checkbox, Icon, Link, Text} from '@gravity-ui/uikit';
import {LogoTelegram, Globe, CircleQuestion, GraduationCap} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {useState} from 'react';
import TelegramLoginButton from '@/components/TelegramLoginButton';
import {LogoLoad} from '@/components/logoLoad';

export default function LoginPage() {
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

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
            <motion.div
                animate={{y: -24, scale: 1}}
                transition={{delay: 0.5}}
                style={{y: 120, zIndex: 100, scale: 0.9, alignContent: 'center'}}
            >
                <Card
                    style={{
                        width: 330,
                        height: 450,
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
                    }}
                >
                    <div
                        style={{
                            height: 48,
                            width: '100%',
                            position: 'relative',
                            marginTop: 450 / 2 - 80,
                        }}
                    >
                        <LogoLoad />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            backdropFilter: 'blur(20px)',
                            height: 83,
                            width: '90%',
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
                                <Link href="https://seller.aurum-sky.net/offer.pdf" target="_blank">
                                    условиями публичной оферты
                                </Link>
                                <div style={{minWidth: 4}} />
                                <Text>и</Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Link
                                    href="https://seller.aurum-sky.net/privacy_policy.pdf"
                                    target="_blank"
                                >
                                    политикой конфиденциальности
                                </Link>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        animate={{
                            scale: privacyPolicyAccepted ? 1 : 0.1,
                            marginTop: 16,
                            marginBottom: privacyPolicyAccepted ? 130 : 0,
                            opacity: privacyPolicyAccepted ? 1 : 0,
                            display: privacyPolicyAccepted ? 'block' : 'block',
                        }}
                        transition={{ease: 'anticipate', duration: 0.6}}
                        style={{overflow: 'hidden', opacity: 0, margin: 0, scale: 0.1}}
                    >
                        <TelegramLoginButton
                            botName={process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'AurumSkyNetBot'}
                            usePic={false}
                            buttonSize="large"
                            dataAuthUrl={
                                process.env.NEXT_PUBLIC_HANDLER_URL ??
                                'https://seller.aurum-sky.net/loginHandler'
                            } // Redirect for all users
                        />
                    </motion.div>
                </Card>
            </motion.div>
            <motion.div
                transition={{delay: 0.5}}
                animate={{opacity: 1}}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: 0,
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
                        Наш телеграм канал
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
                    <div style={{minWidth: 16}} />
                    <Button
                        size="l"
                        pin="circle-circle"
                        target="_blank"
                        href="https://aurum-wiki.tilda.ws/tdocs/"
                    >
                        <Icon data={GraduationCap} />
                        База знаний
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
