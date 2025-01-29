import React, {Children, isValidElement, ReactElement} from 'react';
import {AdvertsWordsModal} from './AdvertsWordsModal';

export const NewPhrasesTemplate = ({children, doc, setChangedDoc}) => {
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
                advertId={undefined}
                art={undefined}
                setChangedDoc={setChangedDoc}
                setFetchedPlacements={undefined}
                currentParsingProgress={undefined}
                setCurrentParsingProgress={undefined}
            >
                {triggerElement}
            </AdvertsWordsModal>
        </>
    );
};
