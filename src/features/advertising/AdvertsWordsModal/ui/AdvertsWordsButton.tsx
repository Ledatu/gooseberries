'use client';

import {Button, Text} from '@gravity-ui/uikit';
import {AdvertsWordsModal} from './AdvertsWordsModal';
// import {AdvertsWordsModal} from './AdvertsWordsModal';

interface AdvertsWordsButtonProps {
    disabled: boolean;
    doc: any;
    selectValue: string[];
    advertId: number;
    art: any;
    setChangedDoc: (args: any) => any;
    setFetchedPlacements: (args: any) => any;
    currentParsingProgress: any;
    setCurrentParsingProgress: (args: any) => any;
    name: string;
}

export const AdvertsWordsButton = ({
    doc,
    selectValue,
    advertId,
    name,
}: AdvertsWordsButtonProps) => {
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
            // nmId={art}
            // disabled={disabled}
            // doc={doc}
            advertId={advertId}
            // art={art}
            // setChangedDoc={setChangedDoc}
            // setFetchedPlacements={setFetchedPlacements}
            // currentParsingProgress={currentParsingProgress}
            // setCurrentParsingProgress={setCurrentParsingProgress}
        >
            <Button size="xs" pin="brick-round" selected={themeToUse != 'normal'} view={themeToUse}>
                <Text variant="caption-2">
                    {themeToUse != 'normal' ? name : 'Фразы'}
                </Text>
            </Button>
        </AdvertsWordsModal>
    );
};
