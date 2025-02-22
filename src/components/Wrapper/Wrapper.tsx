'use client';

import './Wrapper.scss';
import {CampaignProvider} from '@/contexts/CampaignContext';
import {GlobalAlert} from '../GlobalAlert/GlobalAlert';
import {ModuleProvider} from '@/contexts/ModuleProvider';

const DARK = 'dark';
const DEFAULT_THEME = DARK;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
};

export const Wrapper: React.FC<AppProps> = ({children}) => {
    return (
        <CampaignProvider>
            <GlobalAlert />
            <ModuleProvider>{children}</ModuleProvider>
        </CampaignProvider>
    );
};
