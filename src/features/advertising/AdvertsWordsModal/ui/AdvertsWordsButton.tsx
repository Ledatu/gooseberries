'use client';

import {Button, Text} from '@gravity-ui/uikit';
import {AdvertsWordsModal} from './AdvertsWordsModal';
import {ShortAdvertTemplateInfo} from '@/entities/types/ShortAdvertTemplateInfo';
// import {AdvertsWordsModal} from './AdvertsWordsModal';

interface AdvertsWordsButtonProps {
    advertId: number;
    getNames: Function;
    nmId: number;
    template: ShortAdvertTemplateInfo;
    disabled?: boolean;
}

export const AdvertsWordsButton = ({
    template,
    getNames,
    nmId,
    disabled,
}: AdvertsWordsButtonProps) => {
    const {isFixed, includesNum, notIncludesNum, advertId, rulesAI} = template;

    const themeToUse =
        rulesAI && rulesAI !== ''
            ? 'flat-warning'
            : isFixed !== undefined
              ? isFixed === true
                  ? 'flat-warning'
                  : (includesNum && includesNum > 0) || (notIncludesNum && notIncludesNum > 0)
                    ? 'flat-success'
                    : 'flat-info'
              : 'normal';

    return (
        <AdvertsWordsModal getNames={getNames} nmId={nmId} advertId={advertId}>
            <Button
                size="xs"
                pin="brick-round"
                selected={themeToUse != 'normal'}
                view={themeToUse}
                disabled={disabled}
            >
                <Text variant="caption-2">{template.templateName}</Text>
            </Button>
        </AdvertsWordsModal>
    );
};
