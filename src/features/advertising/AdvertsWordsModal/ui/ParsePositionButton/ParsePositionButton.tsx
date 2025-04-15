import {ActionTooltip, Button, Icon, Text} from '@gravity-ui/uikit';
import {CSSProperties} from 'react';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ArrowRight, EyesLookRight, Magnifier, Rocket} from '@gravity-ui/icons';

interface ParsePositionButtonProps {
    phrase: string;
}
export const ParsePositionButton = ({phrase}: ParsePositionButtonProps) => {
    const gap4rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    } as CSSProperties;

    const {parsedPositions, parsePosition} = useAdvertsWordsModal();

    const entry = parsedPositions[phrase];

    return (
        <ActionTooltip
            openDelay={800}
            placement={'left'}
            title="Нажмите, чтобы найти товар в выдаче по этому кластеру."
        >
            <div style={gap4rowStyle}>
                <Button
                    size="xs"
                    view="outlined"
                    onClick={() => parsePosition([phrase])}
                    style={gap4rowStyle}
                >
                    {!entry?.index ? (
                        <Icon data={EyesLookRight} size={16} />
                    ) : (
                        <div style={gap4rowStyle}>
                            <Icon
                                size={13}
                                data={
                                    entry?.advertsType == 'auto'
                                        ? Rocket
                                        : entry?.advertsType == 'search'
                                          ? Magnifier
                                          : EyesLookRight
                                }
                            />
                            {entry?.position !== undefined ? (
                                <div style={gap4rowStyle}>
                                    <Text color="secondary">{entry.position + 1}</Text>
                                    <Icon size={13} data={ArrowRight} />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Text>{entry.index}</Text>
                        </div>
                    )}
                </Button>
                {entry == 'fetching' ? 'Поиск' : <></>}
            </div>
        </ActionTooltip>
    );
};
