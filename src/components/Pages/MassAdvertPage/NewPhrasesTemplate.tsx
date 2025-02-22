'use client';

import {Children, isValidElement, ReactElement} from 'react';
import {AdvertsWordsModal} from './AdvertsWordsModal';

export const NewPhrasesTemplate = ({children, doc, setChangedDoc}: any) => {
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    return (
        <>
            <AdvertsWordsModal
                disabled={false}
                doc={doc}
                advertId={undefined as any}
                art={undefined}
                setChangedDoc={setChangedDoc}
                setFetchedPlacements={() => {}}
                currentParsingProgress={undefined}
                setCurrentParsingProgress={() => {}}
            >
                {triggerElement}
            </AdvertsWordsModal>
        </>
    );
};
