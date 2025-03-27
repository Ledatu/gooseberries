'use client';

import {Dispatch, SetStateAction} from 'react';
// import {AdvertWordsTab} from './AdvertWordsTab';
import {AdvertWordsTabModules} from '../types';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Button, Divider, Icon, Text} from '@gravity-ui/uikit';
import {Check} from '@gravity-ui/icons';
import {CustomTabs} from '@/components/CustomTabs';
import {tabs} from '../config/tabs';

export interface AdvertWordsHeaderProps {
    currentValue: AdvertWordsTabModules;
    setCurrentValue: Dispatch<SetStateAction<AdvertWordsTabModules>>;
}

export const AdvertsWordsHeader = () => {
    const {currentModule, setCurrentModule, setSaveOpen} = useAdvertsWordsModal();

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginInlineEnd: 8,
                }}
            >
                <CustomTabs
                    items={tabs}
                    setModule={setCurrentModule}
                    currentModule={currentModule}
                />
                {/* <AdvertWordsTab currentValue={currentModule} setCurrentValue={setCurrentModule} /> */}
                <Button
                    size="xl"
                    view="flat"
                    onClick={() => {
                        setSaveOpen(true);
                    }}
                >
                    <Text>Сохранить</Text>
                    <Icon data={Check} />
                </Button>
            </div>
            <Divider />
        </div>
    );
};
