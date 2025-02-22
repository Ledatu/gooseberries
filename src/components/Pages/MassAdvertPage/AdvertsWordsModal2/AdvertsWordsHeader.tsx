'use client';

import {Dispatch, SetStateAction} from 'react';
import {AdvertWordsTab} from './AdvertWordsTab';
import {AdvertWordsTabModules} from './types';
import {useAdvertsWordsModal} from './AdvertsWordsModalContext';

export interface AdvertWordsHeaderProps {
    currentValue: AdvertWordsTabModules;
    setCurrentValue: Dispatch<SetStateAction<AdvertWordsTabModules>>;
}

export const AdvertsWordsHeader = () => {
    const {currentModule, setCurrentModule} = useAdvertsWordsModal();

    return (
        <div>
            <AdvertWordsTab currentValue={currentModule} setCurrentValue={setCurrentModule} />
        </div>
    );
};
