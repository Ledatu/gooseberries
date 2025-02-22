// TelegramLoginButton.tsx
'use client';
import {useRef, useEffect} from 'react';

export interface TelegramUser {
    id: number;
    first_name: string;
    username: string;
    photo_url: string;
    auth_date: number;
    hash: string;
}

declare global {
    interface Window {
        TelegramLoginWidget?: {
            dataOnauth?: (user: TelegramUser) => void;
        };
    }
}

const TelegramLoginButton: React.FC<TelegramLoginButtonType> = ({
    wrapperProps,
    dataAuthUrl,
    usePic = false,
    botName,
    className,
    buttonSize = 'large',
    dataOnauth,
    cornerRadius,
    requestAccess = true,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure TelegramLoginWidget is defined on window
        if (typeof window.TelegramLoginWidget === 'undefined') {
            window.TelegramLoginWidget = {};
        }

        // Assign dataOnauth callback directly to window.TelegramLoginWidget
        if (dataOnauth) {
            window.TelegramLoginWidget.dataOnauth = dataOnauth;
        }

        if (ref.current === null) return;

        // Create and append the Telegram widget script
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', buttonSize);

        if (cornerRadius !== undefined) {
            script.setAttribute('data-radius', cornerRadius.toString());
        }

        if (requestAccess) {
            script.setAttribute('data-request-access', 'write');
        }

        script.setAttribute('data-userpic', usePic.toString());

        if (dataAuthUrl) {
            script.setAttribute('data-auth-url', dataAuthUrl);
        }

        script.async = true;
        ref.current.appendChild(script);

        return () => {
            // Cleanup: remove the script and clear the widget
            ref.current?.removeChild(script);
            delete window.TelegramLoginWidget?.dataOnauth;
        };
    }, [botName, buttonSize, cornerRadius, dataOnauth, requestAccess, usePic, dataAuthUrl]);

    return <div ref={ref} className={className} {...wrapperProps} />;
};

interface TelegramLoginButtonType {
    botName: string;
    usePic: boolean;
    className?: string;
    cornerRadius?: number;
    requestAccess?: boolean;
    wrapperProps?: any;
    dataOnauth?: (res: TelegramUser) => void;
    dataAuthUrl?: string;
    buttonSize: 'large' | 'medium' | 'small';
}

export default TelegramLoginButton;
