import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../styles/App.scss';
import '../styles/tailwind.scss';
import '../styles/Logo.scss';

import {RootLayoutClient} from '@/components/RootLayoutClient';
import {ReactNode} from 'react';

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <html lang="ru" translate="no">
            <body>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
