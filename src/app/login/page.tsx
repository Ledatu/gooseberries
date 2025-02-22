// LoginPage.tsx
'use client';
import {Button, Card, Checkbox, Icon, Link, Text} from '@gravity-ui/uikit';
import {LogoTelegram, Globe, CircleQuestion, GraduationCap} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import logo from '@/public/images/LogoLoader.svg';
// import logo from '@/assets/textLogo.png'
import TelegramLoginButton from '@/components/TelegramLoginButton';

export default function LoginPage() {
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
    useEffect(() => {
        console.log('sdksd;kf;lfks;l');
        console.log(logo);
    });

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
                style={{y: 120, zIndex: 100, scale: 0.9}}
            >
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
                    }}
                >
                    <motion.svg
                        // style={{height: '30%'}}
                        animate={{rotate: 120, height: '40%', marginTop: '20%'}}
                        xmlns="http://www.w3.org/2000/svg"
                        width="387"
                        height="445"
                        viewBox="0 0 387 445"
                        fill="none"
                    >
                        <path
                            d="M106 100L0 162V285L106.5 346L106 223.5L212 161.5L106 100Z"
                            fill="url(#paint0_linear_2_8)"
                        />
                        <path
                            d="M120 352.799L226.694 413.597L333.215 352.097L332.792 229.366L226.954 291.049L120.261 230.25L120 352.799Z"
                            fill="url(#paint1_linear_2_8)"
                        />
                        <path
                            d="M333.042 214.799L332.349 92L225.828 30.5L119.75 92.2317L226.088 153.049L226.782 275.847L333.042 214.799Z"
                            fill="url(#paint2_linear_2_8)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2_8"
                                x1="-0.500002"
                                y1="162.5"
                                x2="105.5"
                                y2="223.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#FAC73A" />
                                <stop offset="1" stopColor="#FBB03F" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2_8"
                                x1="227.377"
                                y1="413.78"
                                x2="227.204"
                                y2="291.482"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#FAC73A" />
                                <stop offset="1" stopColor="#FBB03F" />
                            </linearGradient>
                            <linearGradient
                                id="paint2_linear_2_8"
                                x1="332.166"
                                y1="91.317"
                                x2="226.338"
                                y2="152.616"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#FAC73A" />
                                <stop offset="1" stopColor="#FBB03F" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
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
