'use client';

import {Button, Text} from '@gravity-ui/uikit';
import {AdvertsWordsModal} from './AdvertsWordsModal';
import {ShortAdvertTemplateInfo} from '@/entities/types/ShortAdvertTemplateInfo';
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
    template: ShortAdvertTemplateInfo;
}

export const AdvertsWordsButton = ({template}: AdvertsWordsButtonProps) => {
    const {isFixed, includesNum, notIncludesNum, advertId} = template;

    const themeToUse = isFixed !== undefined
        ? isFixed === true
            ? 'flat-warning'
            : (includesNum && includesNum > 0) || (notIncludesNum && notIncludesNum > 0)
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
                <Text variant="caption-2">{template.templateName}</Text>
            </Button>
        </AdvertsWordsModal>
    );
};
