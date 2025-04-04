import {Button, Card, Icon, NumberInput, Text} from '@gravity-ui/uikit';
import {InfoForDescription} from '../hooks/ClustersTableContext';
import {HelpMark} from '@/components/Popups/HelpMark';
import {getNameOfRule} from '../config/rules';
import {Minus, Plus} from '@gravity-ui/icons';
import {cx} from '@/lib/utils';

interface DescriptionClusterPopupProps {
    info: InfoForDescription;
}

export const DescriptionClusterPopup = ({info}: DescriptionClusterPopupProps) => {
    const isPhrasesExcludedByMinusElement = info.isPhrasesExcludedByMinus ? (
        <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
            <Text>Вы нажали на</Text>
            <Button size="xs" view={'outlined-danger'}>
                <Icon data={Minus} />
            </Button>
        </div>
    ) : undefined;
    const includedPhrasesElement = info.includesPhrases?.length ? (
        <div>
            <Text>не содержит ни одной выбранной автофразы</Text>
        </div>
    ) : undefined;
    const notIncludedPhrasesElement = info.notIncludesPhrases?.length ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <Text>содержит следующие минус фразы: </Text>
            <div style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                {info.notIncludesPhrases.map((phrase) => (
                    <Button view="flat-danger">
                        <Text>{phrase}</Text>
                    </Button>
                ))}
                {/* <Text>{`[${info.notIncludesPhrases.join(', ')}]`}</Text> */}
            </div>
        </div>
    ) : undefined;
    const rulesItem = info.rules.length ? (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Text>он был отфильтрован по следующим правилам:</Text>
            {info.rules.map((rule) => (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 12,
                        alignItems: 'center',
                        // justifyContent: 'space-between',
                    }}
                >
                    <Text variant="subheader-1">Если просмотров ≥</Text>
                    <NumberInput
                        style={{width: '25%'}}
                        value={rule.viewsThreshold}
                        hiddenControls={true}
                        readOnly={true}
                    />
                    <Text
                        variant="subheader-1"
                        style={{width: 135}}
                    >{`и ${getNameOfRule(rule.key)}`}</Text>
                    <Button style={{width: 28}} selected={rule.biggerOrEqual} view={'outlined'}>
                        <Text>{rule.biggerOrEqual ? '≥' : '<'}</Text>
                    </Button>
                    <NumberInput
                        style={{width: '25%'}}
                        value={rule.val}
                        hiddenControls={true}
                        readOnly={true}
                    />
                </div>
            ))}
        </div>
    ) : undefined;

    if (info.excluded)
        return (
            <HelpMark
                content={
                    <div
                        style={{
                            width: 0,
                            height: 0,
                            position: 'relative',
                        }}
                    >
                        <Card
                            className={cx(['blurred-card', 'centred-absolute-element'])}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                width: 500,
                                padding: 8,
                                height: 'fit-content',
                            }}
                        >
                            <Text variant="subheader-3">Кластер был исключён, так как:</Text>
                            {isPhrasesExcludedByMinusElement}
                            {includedPhrasesElement}
                            {notIncludedPhrasesElement}
                            {rulesItem}
                        </Card>
                    </div>
                }
            />
        );
    else {
        const isPhrasesSelectedByPlusElement = info.isPhrasesSelectedByPlus ? (
            <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                <Text>Вы нажали на </Text>
                <Button size="xs" view={'outlined-action'}>
                    <Icon data={Plus} />
                </Button>
            </div>
        ) : undefined;
        const includedPhrasesElement = info.includesPhrases?.length ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                <Text>содержит следующие авто фразы: </Text>
                <div style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                    {info.includesPhrases.map((phrase) => (
                        <Button view="flat-success">
                            <Text>{phrase}</Text>
                        </Button>
                    ))}
                    {/* <Text>{`[${info.notIncludesPhrases.join(', ')}]`}</Text> */}
                </div>
            </div>
        ) : undefined;

        return (
            <HelpMark
                content={
                    <div
                        style={{
                            width: 0,
                            height: 0,
                            position: 'relative',
                        }}
                    >
                        <Card
                            className={cx(['blurred-card', 'centred-absolute-element'])}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                width: 500,
                                padding: 8,
                                height: 'fit-content',
                            }}
                        >
                            <Text variant="subheader-3">Кластер был включен, так как:</Text>
                            {isPhrasesSelectedByPlusElement}
                            {includedPhrasesElement}
                        </Card>
                    </div>
                }
            />
        );
    }
};
