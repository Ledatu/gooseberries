import {Button, Text, Card, Divider, Icon, ActionTooltip, Switch} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {ReactNode, useEffect, useMemo, useState} from 'react';
import {getIconOfThresholdKey, getNameOfRule} from '../../config/rules';
import {Eye} from '@gravity-ui/icons';
import {useUser} from '@/components/RequireAuth';

export const AdditionalInfoTab = () => {
    const {template, advertId, setCurrentModule, setTemplate} = useAdvertsWordsModal();
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
                <Button
                    size="l"
                    pin="circle-circle"
                    onClick={() => {
                        setCurrentModule('Settings');
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        <Icon data={getIconOfThresholdKey(rule.thresholdKey ?? 'views')} />
                        {`${rule.viewsThreshold} и ${getNameOfRule(rule.key)} ${rule.biggerOrEqual ? '≥' : '<'} ${rule.val}`}
                    </div>
                </Button>
            </ActionTooltip>
        ));
        setRules(tempRules);
    }, [template, advertId]);

    const isFixed = template.isFixed && template.fixedClusters.length;
    const {rulesAI} = template;
    const {userInfo} = useUser();
    const {user} = userInfo ?? {};
    const admin = useMemo(
        () => [1122958293, 933839157, 566810027, 78342325].includes(user?._id),
        [user],
    );

    const toogleAI = (version: string) => {
        setTemplate({...template, rulesAI: rulesAI !== '' ? '' : version});
    };
    {
        admin ? (
            <Button
                size="l"
                pin="circle-circle"
                selected={rulesAI !== ''}
                onClick={() => toogleAI('AURUMSKYNET AI фильтр')}
            >
                Включить автоматическую фильтрацию AURUMSKYNET AI
            </Button>
        ) : (
            <></>
        );
    }

    console.log(advertId, rulesAI);

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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginInline: 8,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
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
                    {template.includes.length || template.notIncludes.length ? (
                        <ActionTooltip
                            title={`${isFixed ? 'Автофразы не будут работать так как включены фикс. фразы, выключите их, чтобы Автофразы заработали. ' : ''}Нажмите, чтобы редактировать.`}
                        >
                            <Button
                                size="l"
                                pin="circle-circle"
                                selected
                                view={isFixed ? 'outlined-danger' : 'outlined-warning'}
                                style={{paddingInline: 16}}
                                onClick={() => {
                                    setCurrentModule('AutoPhrases');
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: '100%',
                                        gap: 4,
                                    }}
                                >
                                    <Text>{`Автофразы ${isFixed ? 'выкл.' : 'при'}`}</Text>
                                    <Icon data={Eye} />
                                    <Text>{template.viewsThreshold}</Text>
                                </div>
                            </Button>
                        </ActionTooltip>
                    ) : (
                        <></>
                    )}
                    {template.fixedClusters.length && !rulesAI ? (
                        <ActionTooltip
                            title={`${!template.isFixed ? 'Фикс. фразы не будут работать так как они выключены, включите их в настройках чтобы они заработали. ' : ''}Нажмите, чтобы редактировать.`}
                        >
                            <Button
                                size="l"
                                pin="circle-circle"
                                selected={template.isFixed}
                                style={{paddingInline: 16}}
                                onClick={() => {
                                    setCurrentModule('Settings');
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: '100%',
                                        gap: 4,
                                    }}
                                >
                                    <Text>Фикс. фразы</Text>
                                    <Text>{`${template.fixedClusters.length} шт.${!template.isFixed ? ' (Не активны)' : ''}`}</Text>
                                </div>
                            </Button>
                        </ActionTooltip>
                    ) : (
                        <></>
                    )}
                    {rulesAI ? <></> : rules}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <Text
                        color={rulesAI !== '' ? 'brand' : 'primary'}
                        variant="subheader-2"
                        onClick={() => toogleAI('AI')}
                    >
                        Автофильтрация кластеров AURUMSKYNET AI
                    </Text>
                    <Switch checked={rulesAI !== ''} size="l" onUpdate={() => toogleAI('AI')} />
                </div>
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
