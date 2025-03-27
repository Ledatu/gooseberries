'use client';

import {Tab, TabProvider, Text} from '@gravity-ui/uikit';
import {ReactNode} from 'react';

import {AdvertWordsTabModules} from '../types';
import {motion} from 'framer-motion';
import {tabsNames} from '../config';

interface CustomTabProps {
    value: AdvertWordsTabModules;
    name: string;
    isSelected: boolean;
}

const CustomTab = ({value, name, isSelected}: CustomTabProps) => {
    return (
        <Tab value={value} title={name}>
            <div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: 60,
                    }}
                >
                    <Text style={{top: isSelected ? -5 : 0}} variant="body-3">
                        {name}
                    </Text>
                </div>

                {isSelected ? (
                    <motion.div layoutId="underline" style={{borderBottom: '5px solid #ffbe5c'}} />
                ) : (
                    <div style={{borderBottom: '5px #00000000'}} />
                )}
            </div>
        </Tab>
    );
};

export interface AdvertWordsTabProps {
    currentValue: AdvertWordsTabModules;
    setCurrentValue: (value: AdvertWordsTabModules) => any;
}
export const AdvertWordsTab = ({currentValue, setCurrentValue}: AdvertWordsTabProps) => {
    const Tabs = () => {
        const currentTabs: ReactNode[] = [];
        console.log(tabsNames);
        for (const name of tabsNames) {
            currentTabs.push(
                <CustomTab
                    name={name.name}
                    value={name.value}
                    isSelected={currentValue === name.value}
                />,
            );
        }
        console.log(currentTabs);
        return currentTabs;
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                paddingInline: '16px',
                // width: '100%',

                // borderBottom: '4px rgb(89, 85, 89)',
            }}
        >
            <TabProvider
                value={currentValue}
                onUpdate={(value) => {
                    setCurrentValue(value as AdvertWordsTabModules);
                }}
            >
                {Tabs()}
            </TabProvider>
        </div>
    );
};
