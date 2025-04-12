'use client';

import {Dispatch, SetStateAction} from 'react';
import {AdvertWordsTabModules} from '../types';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {ActionTooltip, Button, Divider, Icon} from '@gravity-ui/uikit';
import {CloudCheck, TriangleExclamation} from '@gravity-ui/icons';
import {CustomTabs} from '@/components/CustomTabs';
import {tabs} from '../config/tabs';
export interface AdvertWordsHeaderProps {
    currentValue: AdvertWordsTabModules;
    setCurrentValue: Dispatch<SetStateAction<AdvertWordsTabModules>>;
}

export const AdvertsWordsHeader = () => {
    const {currentModule, setCurrentModule, setSaveOpen, templateChanged} = useAdvertsWordsModal();
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 15,
                    marginRight: 20,
                }}
            >
                <CustomTabs
                    items={tabs}
                    setModule={setCurrentModule}
                    currentModule={currentModule}
                />
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <Button
                        pin="circle-circle"
                        size="xl"
                        view={templateChanged ? 'outlined-action' : 'flat'}
                        onClick={() => {
                            setSaveOpen(true);
                        }}
                    >
                        Сохранить
                    </Button>
                    <ActionTooltip
                        title={templateChanged ? 'Изменения не сохранены' : 'Правила сохранены'}
                    >
                        <Button
                            view={templateChanged ? 'flat-action' : 'flat'}
                            pin="circle-circle"
                            size="s"
                        >
                            <Icon data={templateChanged ? TriangleExclamation : CloudCheck} />
                        </Button>
                    </ActionTooltip>
                </div>
            </div>
            <Divider />
        </div>
    );
};
