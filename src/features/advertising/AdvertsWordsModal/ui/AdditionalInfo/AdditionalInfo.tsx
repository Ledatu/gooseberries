import {Button, Text, Card, Divider, Icon, ActionTooltip} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ReactNode, useEffect, useState} from 'react';
import {getNameOfRule} from '../../config/rules';
import {Eye} from '@gravity-ui/icons';

export const AdditionalInfoTab = () => {
    const {template, advertId} = useAdvertsWordsModal();
    const [alert, setAlert] = useState<boolean>(false);
    const [rules, setRules] = useState<ReactNode>([]);
    useEffect(() => {
        if (template.excludedNum >= 1000) {
            setAlert(true);
        } else {
            setAlert(false);
        }
        const tempRules = (template?.rules ?? []).map((rule) => (
            <ActionTooltip title="Нажмите, чтобы редактировать.">
                <Button size="l" pin="circle-circle">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        <Icon data={Eye} />
                        {`${rule.viewsThreshold} и ${getNameOfRule(rule.key)} ${rule.biggerOrEqual ? '≥' : '<'} ${rule.val}`}
                    </div>
                </Button>
            </ActionTooltip>
        ));
        setRules(tempRules);
    }, [template, advertId]);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 16,
                paddingBottom: 8,
                gap: 16,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    marginInline: 8,
                }}
            >
                <Button
                    size="l"
                    pin="circle-circle"
                    selected
                    view={'outlined-success'}
                    style={{paddingInline: 16}}
                >
                    <Text>{advertId}</Text>
                </Button>
                {template.name ? (
                    <Button
                        size="l"
                        pin="circle-circle"
                        selected
                        view={'outlined-info'}
                        style={{paddingInline: 16}}
                    >
                        <Text>{template.name}</Text>
                    </Button>
                ) : undefined}
                {rules}
            </div>
            {alert ? (
                <Card
                    size="m"
                    view="filled"
                    theme="danger"
                    style={{
                        borderRadius: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowWrap: 'break-word',
                        // maxWidth: '80%',
                        maxWidth: '100%',
                        // flexGrow: 1,
                        color: 'rgb(232, 71, 109)',
                        padding: 16,
                        marginInline: 8,
                        gap: 8,
                        // background: 'rgba(229, 50, 93, 0.2)',
                    }}
                    // maxWidth={550}
                >
                    <Text variant="body-1">
                        {
                            'Исключению подлежит более 1000 фраз, что невозможно из-за ограничений установленных WB. Пожалуйста пересоздайте рекламную компанию или измените фильтры'
                        }
                    </Text>
                </Card>
            ) : (
                <></>
            )}
            <Divider orientation="horizontal" />
        </div>
    );
};
