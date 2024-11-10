import {Button, Text} from '@gravity-ui/uikit';
import {AdvertsWordsModal} from './AdvertsWordsModal';
import React from 'react';

export const AdvertsWordsButton = ({
    disabled,
    doc,
    selectValue,
    advertId,
    art,
    setChangedDoc,
    setFetchedPlacements,
    currentParsingProgress,
    setCurrentParsingProgress,
    columnDataAuction,
    auctionOptions,
    auctionSelectedOption,
    setAuctionSelectedOption,
}) => {
    const plusPhrasesTemplate = doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId]
        ? doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId].templateName
        : undefined;
    const {isFixed, autoPhrasesTemplate} =
        doc.plusPhrasesTemplates[selectValue[0]][plusPhrasesTemplate] ?? {};

    const themeToUse = plusPhrasesTemplate
        ? isFixed
            ? 'flat-warning'
            : autoPhrasesTemplate &&
              ((autoPhrasesTemplate.includes && autoPhrasesTemplate.includes.length) ||
                  (autoPhrasesTemplate.notIncludes && autoPhrasesTemplate.notIncludes.length))
            ? 'flat-success'
            : 'flat-info'
        : 'normal';

    return (
        <AdvertsWordsModal
            disabled={disabled}
            doc={doc}
            advertId={advertId}
            art={art}
            setChangedDoc={setChangedDoc}
            setFetchedPlacements={setFetchedPlacements}
            currentParsingProgress={currentParsingProgress}
            setCurrentParsingProgress={setCurrentParsingProgress}
            columnDataAuction={columnDataAuction}
            auctionOptions={auctionOptions}
            auctionSelectedOption={auctionSelectedOption}
            setAuctionSelectedOption={setAuctionSelectedOption}
        >
            <Button size="xs" pin="brick-round" selected={themeToUse != 'normal'} view={themeToUse}>
                <Text variant="caption-2">
                    {themeToUse != 'normal' ? plusPhrasesTemplate : 'Фразы'}
                </Text>
            </Button>
        </AdvertsWordsModal>
    );
};
